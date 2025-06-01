import { Database } from "@database/database";
import { authTokenTable } from "@database/tables/auth-token-table";
import { userTable } from "@database/tables/user-table";
import { ProtectedUserDTO } from "@dto/protected-user-dto";
import { env } from "@env";
import {
  IncorrectPasswordError,
  InvalidAuthTokenError,
  InvalidUsernameError,
  UsernameAlreadyTakenError,
  UserNotFoundError,
} from "@errors/service-errors";
import { dateStringToISO } from "@utils/date-string-to-iso";
import { logger } from "@utils/logger";
import { AuthTokenValue } from "@value-objects/auth-token-values";
import { UserValue } from "@value-objects/user-values";
import { compare, hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Session, SessionData } from "express-session";

export type AuthServiceOptions = {
  readonly passwordHashRounds: number;
};

export class AuthService {
  private readonly passwordHashRounds: AuthServiceOptions["passwordHashRounds"];

  public constructor(
    private readonly database: Database,
    options: AuthServiceOptions
  ) {
    this.passwordHashRounds = options.passwordHashRounds;
  }

  public async verifyAuthToken(value: string): Promise<boolean> {
    // TEMP START
    if (value === env.TEMP_TOKEN) return true;
    // TEMP END
    const tokenVerifyResult = AuthTokenValue.Token.verify(value);
    if (!tokenVerifyResult.success) {
      return false;
    }

    const result = await this.database
      .select({ exists: sql<number>`1` })
      .from(authTokenTable)
      .where(eq(authTokenTable.token, tokenVerifyResult.data.value))
      .execute();

    return result.length !== 0;
  }

  public async getCurrentUser(
    session: Session & Partial<SessionData>
  ): Promise<ProtectedUserDTO | null> {
    const userUid = session.userUid;
    if (userUid === undefined) {
      return null;
    }

    const user = (
      await this.database
        .select({
          username: userTable.username,
          name: userTable.name,
          isAdmin: userTable.isAdmin,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);

    if (user === undefined) {
      session.destroy((error) => {
        if (error) {
          logger.error(error);
        }
      });
      return null;
    }

    return new ProtectedUserDTO({
      ...user,
      createdAt: dateStringToISO(user.createdAt),
    });
  }

  public async signup(
    session: Partial<SessionData>,
    credentials: {
      token: string;
      username: UserValue.Username;
      password: UserValue.Password;
      name: UserValue.Name;
    }
  ): Promise<void> {
    await this.database.transaction(
      async (tx) => {
        // TEMP START
        if (credentials.token === env.TEMP_TOKEN) {
          const existsUser = (
            await tx
              .select({ exists: sql<number>`1` })
              .from(userTable)
              .for("update")
              .where(eq(userTable.username, credentials.username.value))
              .execute()
          ).at(0);
          if (existsUser !== undefined) {
            return Promise.reject(new UsernameAlreadyTakenError());
          }

          const user = (
            await tx
              .insert(userTable)
              .values({
                username: credentials.username.value,
                passwordHash: Buffer.from(
                  await hash(
                    credentials.password.value,
                    this.passwordHashRounds
                  )
                ),
                name: credentials.name.value,
                isAdmin: false,
              })
              .$returningId()
              .execute()
          )[0];

          session.userUid = user.uid;
          return;
        }
        // TEMP END

        const verifiedToken = AuthTokenValue.Token.verify(credentials.token);
        if (!verifiedToken.success) {
          return Promise.reject(new InvalidAuthTokenError());
        }

        const authToken = (
          await tx
            .select({ isAdminToken: authTokenTable.isAdminToken })
            .from(authTokenTable)
            .for("update")
            .where(eq(authTokenTable.token, verifiedToken.data.value))
            .execute()
        ).at(0);
        if (authToken === undefined) {
          return Promise.reject(new InvalidAuthTokenError());
        }

        const existsUser = (
          await tx
            .select({ exists: sql<number>`1` })
            .from(userTable)
            .for("update")
            .where(eq(userTable.username, credentials.username.value))
            .execute()
        ).at(0);
        if (existsUser !== undefined) {
          return Promise.reject(new UsernameAlreadyTakenError());
        }

        const user = (
          await tx
            .insert(userTable)
            .values({
              username: credentials.username.value,
              passwordHash: Buffer.from(
                await hash(credentials.password.value, this.passwordHashRounds)
              ),
              name: credentials.name.value,
              isAdmin: authToken.isAdminToken,
            })
            .$returningId()
            .execute()
        )[0];

        await tx
          .delete(authTokenTable)
          .where(eq(authTokenTable.token, verifiedToken.data.value))
          .execute();

        session.userUid = user.uid;
      },
      {
        isolationLevel: "repeatable read",
      }
    );
  }

  public async signin(
    session: Partial<SessionData>,
    credentials: {
      username: string;
      password: string;
    }
  ): Promise<void> {
    const user = (
      await this.database
        .select({
          uid: userTable.uid,
          passwordHash: userTable.passwordHash,
        })
        .from(userTable)
        .where(eq(userTable.username, credentials.username))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new InvalidUsernameError());
    }

    const isCorrect = await compare(
      credentials.password,
      user.passwordHash.toString()
    );
    if (!isCorrect) {
      return Promise.reject(new IncorrectPasswordError());
    }

    session.userUid = user.uid;
  }

  public async signout(session: Session & Partial<SessionData>): Promise<void> {
    return new Promise((resolve, reject) => {
      session.destroy((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  public async updatePassword(
    uid: number,
    currentPassword: string,
    newPassword: UserValue.Password
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      const user = (
        await tx
          .select({ passwordHash: userTable.passwordHash })
          .from(userTable)
          .for("update")
          .where(eq(userTable.uid, uid))
          .execute()
      ).at(0);
      if (user === undefined) {
        return Promise.reject(new UserNotFoundError());
      }

      const isCorrect = await compare(
        currentPassword,
        user.passwordHash.toString()
      );
      if (!isCorrect) {
        return Promise.reject(new IncorrectPasswordError());
      }

      await tx
        .update(userTable)
        .set({
          passwordHash: Buffer.from(
            await hash(newPassword.value, this.passwordHashRounds)
          ),
        })
        .where(eq(userTable.uid, uid))
        .execute();
    });
  }
}
