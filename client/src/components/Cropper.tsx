// import "cropperjs/dist/cropper.css";

import { ComponentProps, FC } from "react";
import ReactCropper from "react-cropper";

type Props = ComponentProps<typeof ReactCropper>;

export const Cropper: FC<Props> = (props) => {
  return <ReactCropper {...props} />;
};
