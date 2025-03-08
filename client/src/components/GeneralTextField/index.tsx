import { TextField } from "@mui/material";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<typeof TextField>;

export const GeneralTextField: FC<Props> = (props) => {
  return (
    <TextField fullWidth autoComplete="off" spellCheck="false" {...props} />
  );
};
