import { Database } from "@database/database";
import { articleTable } from "@database/tables/article-table";
import { userTable } from "@database/tables/user-table";
import { ArticleDTO } from "@dto/article-dto";
import { ContentlessArticleDTO } from "@dto/contentless-article-dto";
import { PublicUserDTO } from "@dto/public-user-dto";
import {
  ArticleNotFoundError,
  QueryLimitOutOfBoundsError,
  QueryOffsetOutOfBoundsError,
  UserNotFoundError,
} from "@errors/service-errors";
import { dateStringToISO } from "@utils/date-string-to-iso";
import { ArticleValue } from "@value-objects/article-values";
import { CategoryValue } from "@value-objects/category-values";
import { and, count, desc, eq, isNull, sql, SQL } from "drizzle-orm";

export type ArticleServiceOptions = {
  maxQueryLimit: number;
  defaultThumbnailName: string;
  thumbnailBaseUrl: URL;
};

export class ArticleService {
  private readonly maxQueryLimit: ArticleServiceOptions["maxQueryLimit"];
  private readonly defaultThumbnailName: ArticleServiceOptions["defaultThumbnailName"];
  private readonly thumbnailBaseUrl: ArticleServiceOptions["thumbnailBaseUrl"];
  public constructor(
    private readonly database: Database,
    options: ArticleServiceOptions
  ) {
    this.maxQueryLimit = options.maxQueryLimit;
    this.defaultThumbnailName = options.defaultThumbnailName;
    this.thumbnailBaseUrl = options.thumbnailBaseUrl;
  }

  public async getOne(uid: number): Promise<ArticleDTO> {
    const article = (
      await this.database
        .select({
          uid: articleTable.uid,
          uploaderUsername: userTable.username,
          uploaderName: userTable.name,
          category: articleTable.categoryName,
          thumbnailName: articleTable.thumbnailName,
          thumbnailCaption: articleTable.thumbnailCaption,
          title: articleTable.title,
          subtitle: articleTable.subtitle,
          content: articleTable.content,
          likeCount: articleTable.likeCount,
          dislikeCount: articleTable.dislikeCount,
          createdAt: articleTable.createdAt,
          updatedAt: articleTable.updatedAt,
        })
        .from(articleTable)
        .leftJoin(userTable, eq(userTable.uid, articleTable.uploaderUid))
        .where(eq(articleTable.uid, uid))
        .execute()
    ).at(0);

    if (article === undefined) {
      return Promise.reject(new ArticleNotFoundError());
    }

    return new ArticleDTO({
      ...article,
      uploader:
        article.uploaderUsername && article.uploaderName
          ? new PublicUserDTO({
              username: article.uploaderUsername,
              name: article.uploaderName,
            })
          : null,
      thumbnail: {
        url: new URL(article.thumbnailName, this.thumbnailBaseUrl).href,
        name: article.thumbnailName,
        caption: article.thumbnailCaption,
      },
      createdAt: dateStringToISO(article.createdAt),
      updatedAt: dateStringToISO(article.updatedAt),
    });
  }

  public async getMany(query: {
    uploaderUsername?: string;
    categoryName?: string | null;
    offset?: number;
    limit?: number;
  }): Promise<{ total: number; items: ContentlessArticleDTO[] }> {
    const limit = await (async () => {
      const limit = query.limit;
      if (limit === undefined) {
        return this.maxQueryLimit;
      }
      const min = 1;
      const max = this.maxQueryLimit;
      if (limit < min || limit > max) {
        return Promise.reject(
          new QueryLimitOutOfBoundsError(
            `Query limit must be between ${min} and ${max}, inclusive`
          )
        );
      }
      return limit;
    })();

    const offset = await (async () => {
      const offset = query.offset;
      if (offset === undefined) {
        return 0;
      }
      if (offset < 0) {
        return Promise.reject(
          new QueryOffsetOutOfBoundsError(
            `Query offset must be greater than or equal to 0`
          )
        );
      }
      return offset;
    })();

    const uploaderUid: number | undefined = await (async () => {
      const uploaderUsername = query.uploaderUsername;
      if (uploaderUsername === undefined) {
        return undefined;
      }

      const uploader = (
        await this.database
          .select({ uid: userTable.uid })
          .from(userTable)
          .where(eq(userTable.username, uploaderUsername))
          .execute()
      ).at(0);
      if (uploader === undefined) {
        return Promise.reject(new UserNotFoundError());
      }
      return uploader.uid;
    })();

    const categoryName = query.categoryName;

    const conditions: SQL[] = [];
    if (uploaderUid !== undefined) {
      conditions.push(eq(articleTable.uploaderUid, uploaderUid));
    }
    if (categoryName !== undefined) {
      if (categoryName !== null) {
        conditions.push(eq(articleTable.categoryName, categoryName));
      } else {
        conditions.push(isNull(articleTable.categoryName));
      }
    }
    const condition = and(...conditions);

    const articles = await this.database
      .select({
        uid: articleTable.uid,
        uploaderUsername: userTable.username,
        uploaderName: userTable.name,
        category: articleTable.categoryName,
        thumbnailName: articleTable.thumbnailName,
        thumbnailCaption: articleTable.thumbnailCaption,
        title: articleTable.title,
        subtitle: articleTable.subtitle,
        likeCount: articleTable.likeCount,
        dislikeCount: articleTable.dislikeCount,
        createdAt: articleTable.createdAt,
        updatedAt: articleTable.updatedAt,
      })
      .from(articleTable)
      .leftJoin(userTable, eq(userTable.uid, articleTable.uploaderUid))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(articleTable.createdAt))
      .where(condition)
      .execute();

    const total = (
      await this.database
        .select({ count: count() })
        .from(articleTable)
        .where(condition)
        .execute()
    )[0].count;

    return {
      total,
      items: articles.map(
        (article) =>
          new ContentlessArticleDTO({
            ...article,
            uploader:
              article.uploaderUsername && article.uploaderName
                ? new PublicUserDTO({
                    username: article.uploaderUsername,
                    name: article.uploaderName,
                  })
                : null,
            thumbnail: {
              url: new URL(article.thumbnailName, this.thumbnailBaseUrl).href,
              name: article.thumbnailName,
              caption: article.thumbnailCaption,
            },
            createdAt: dateStringToISO(article.createdAt),
            updatedAt: dateStringToISO(article.updatedAt),
          })
      ),
    };
  }

  public async post(
    uploaderUid: number,
    categoryName: CategoryValue.Name | null,
    thumbnail: {
      name: ArticleValue.ThumbnailName;
      caption: ArticleValue.ThumbnailCaption;
    } | null,
    title: ArticleValue.Title,
    subtitle: ArticleValue.Subtitle,
    content: ArticleValue.Content
  ): Promise<{ uid: number }> {
    const article = (
      await this.database
        .insert(articleTable)
        .values({
          uploaderUid,
          categoryName: categoryName?.value ?? null,
          thumbnailName: thumbnail?.name.value ?? this.defaultThumbnailName,
          thumbnailCaption: thumbnail?.caption.value ?? "",
          title: title.value,
          subtitle: subtitle.value,
          content: content.value,
        })
        .$returningId()
        .execute()
    )[0];

    return { uid: article.uid };
  }

  public async patch(
    userUid: number,
    articleUid: number,
    data: {
      categoryName?: CategoryValue.Name;
      thumbnail?: {
        name: ArticleValue.ThumbnailName;
        caption: ArticleValue.ThumbnailCaption;
      } | null;
      title?: ArticleValue.Title;
      subtitle?: ArticleValue.Subtitle;
      content?: ArticleValue.Content;
    }
  ): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    const [header] = await this.database
      .update(articleTable)
      .set({
        categoryName: data.categoryName?.value,
        thumbnailName: data.thumbnail?.name.value,
        thumbnailCaption: data.thumbnail?.caption.value,
        title: data.title?.value,
        subtitle: data.subtitle?.value,
        content: data.content?.value,
      })
      .where(
        user.isAdmin
          ? eq(articleTable.uid, articleUid)
          : and(
              eq(articleTable.uid, articleUid),
              eq(articleTable.uploaderUid, userUid)
            )
      )
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new ArticleNotFoundError());
    }
  }

  public async delete(userUid: number, articleUid: number): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    const [header] = await this.database
      .delete(articleTable)
      .where(
        user.isAdmin
          ? eq(articleTable.uid, articleUid)
          : and(
              eq(articleTable.uid, articleUid),
              eq(articleTable.uploaderUid, userUid)
            )
      )
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new ArticleNotFoundError());
    }
  }

  public async like(articleUid: number): Promise<void> {
    await this.database
      .update(articleTable)
      .set({
        likeCount: sql`${articleTable.likeCount} + 1`,
      })
      .where(eq(articleTable.uid, articleUid));
  }

  public async dislike(articleUid: number): Promise<void> {
    await this.database
      .update(articleTable)
      .set({
        dislikeCount: sql`${articleTable.dislikeCount} + 1`,
      })
      .where(eq(articleTable.uid, articleUid));
  }
}
