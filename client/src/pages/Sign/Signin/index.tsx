import styles from "../styles.module.scss";

import { TextFieldChangeEvent } from "@/types/mui";
import { GeneralTextField } from "@components/GeneralTextField";
import { signin } from "@services/auth-service";
import { FC, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signin: FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signin(username, password);
        navigate("/");
        navigate(0);
      } catch {
        alert("Failed to sign in");
      }
    },
    [password, username, navigate]
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

  return (
    <>
      <h2 className={styles.title}>로그인</h2>
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
        <button className={styles.submit} type="submit">
          로그인
        </button>
      </form>
    </>
  );
};
