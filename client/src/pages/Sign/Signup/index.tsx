import styles from "../styles.module.scss";

import { TextFieldChangeEvent } from "@/types/mui";
import { GeneralTextField } from "@components/GeneralTextField";
import { signup, verifyAuthToken } from "@services/auth-service";
import { FC, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup: FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);

  const handleAuthTokenSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const valid = await verifyAuthToken(token);
      if (!valid) {
        setTokenMessage("Invalid auth token");
        return;
      }
      setHasToken(true);
    },
    [token]
  );

  const handleAuthTokenChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setToken(target.value);
      setTokenMessage(null);
    },
    []
  );

  const handleCredentialsSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signup(token, username, password, name);
        navigate("/");
        navigate(0);
      } catch (error: any) {
        const details = error.details;
        if (details) {
          const usernameError = details?.fieldErrors?.username?.errorMessage;
          if (typeof usernameError === "string") {
            setUsernameMessage(usernameError);
            return;
          }
          const passwordError = details?.fieldErrors?.password?.errorMessage;
          if (typeof passwordError === "string") {
            setPasswordMessage(passwordError);
            return;
          }
          const nameError = details?.fieldErrors?.name?.errorMessage;
          if (typeof nameError === "string") {
            setNameMessage(nameError);
            return;
          }
        }
        alert("Unknown error occured while signing up");
      }
    },
    [name, password, token, username, navigate]
  );

  const handleUsernameChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setUsername(target.value);
      setUsernameMessage(null);
    },
    []
  );

  const handlePasswordChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setPassword(target.value);
      setPasswordMessage(null);
    },
    []
  );

  const handleNameChange = useCallback(({ target }: TextFieldChangeEvent) => {
    setName(target.value);
    setNameMessage(null);
  }, []);

  return (
    <>
      <h2 className={styles.title}>회원가입</h2>
      {!hasToken ? (
        <form className={styles.form} onSubmit={handleAuthTokenSubmit}>
          <GeneralTextField
            label="인증 토큰"
            value={token}
            onChange={handleAuthTokenChange}
            helperText={tokenMessage ?? ""}
            error={tokenMessage !== null}
            autoFocus
          />
          <button className={styles.submit} type="submit">
            다음
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleCredentialsSubmit}>
          <GeneralTextField
            label="아이디"
            value={username}
            onChange={handleUsernameChange}
            helperText={usernameMessage ?? ""}
            error={usernameMessage !== null}
            autoFocus
          />
          <GeneralTextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            helperText={passwordMessage ?? ""}
            error={passwordMessage !== null}
          />
          <GeneralTextField
            label="표시 이름"
            value={name}
            onChange={handleNameChange}
            helperText={nameMessage ?? ""}
            error={nameMessage !== null}
          />
          <button className={styles.submit} type="submit">
            가입
          </button>
        </form>
      )}
    </>
  );
};
