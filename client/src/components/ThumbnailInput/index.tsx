import styles from "./styles.module.scss";

import { TextFieldChangeEvent } from "@/types/mui";
import { Cropper } from "@components/Cropper";
import { GeneralTextField } from "@components/GeneralTextField";
import {
  postThumbnail,
  THUMBNAIL_SERVICE_URL,
} from "@services/thumbnail-service";
import { renderBlobToCanvas } from "@utils/render-blob-to-canvas";
import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export type ThumbnailRef = {
  name: string | null;
  setName: Dispatch<SetStateAction<string | null>>;
  caption: string;
  setCaption: Dispatch<SetStateAction<string>>;
};

type Props = {
  captionMessage?: string | null;
  captionError?: boolean;
};

export const ThumbnailInput = forwardRef<ThumbnailRef, Props>((props, ref) => {
  const { captionMessage, captionError = false } = props;
  const [name, setName] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [cropper, setCropper] = useState<Cropper>();
  const url = useMemo(() => {
    return name !== null ? `${THUMBNAIL_SERVICE_URL}/${name}` : null;
  }, [name]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        name: name,
        setName: setName,
        caption: caption,
        setCaption: setCaption,
      };
    },
    [name, caption]
  );

  const handleThumbnailCaptionChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setCaption(target.value);
    },
    []
  );

  const handleThumbnailRemove = useCallback(() => {
    setName(null);
  }, []);

  const handleFileChange = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      const files = target.files;
      if (files === null) {
        return;
      }

      const file = files[0];
      target.files = null;
      target.value = "";
      if (!file) {
        return;
      }

      const canvas = await renderBlobToCanvas(file);
      const dataUrl = canvas.toDataURL("image/webp", 1);
      setSelected(dataUrl);
    },
    []
  );

  const handleThumbnailSet = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCropInitialize = useCallback((instance: Cropper) => {
    setCropper(instance);
  }, []);

  const handleCropCancel = useCallback(() => {
    setSelected(null);
  }, []);

  const handleCrop = useCallback(async () => {
    if (cropper === undefined) {
      return;
    }
    const canvas = cropper.getCroppedCanvas({ width: 1280, height: 720 });
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob === null) {
            return reject();
          }
          return resolve(blob);
        },
        "image/webp",
        1
      );
    });

    const { name } = await postThumbnail(blob);
    setName(name);
    setSelected(null);
  }, [cropper]);

  return (
    <>
      <div className={styles.container}>
        {url === null ? (
          <>
            {selected === null ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  hidden
                />
                <button className={styles.button} onClick={handleThumbnailSet}>
                  썸네일 설정
                </button>
              </>
            ) : (
              <>
                <Cropper
                  onInitialized={handleCropInitialize}
                  src={selected}
                  viewMode={1}
                  dragMode="move"
                  cropBoxMovable={false}
                  cropBoxResizable={false}
                  aspectRatio={16 / 9}
                  initialAspectRatio={16 / 9}
                  width="1200px"
                  height="300px"
                />
                <nav className={styles["cropper-nav"]}>
                  <button className={styles.button} onClick={handleCropCancel}>
                    취소
                  </button>
                  <button className={styles.button} onClick={handleCrop}>
                    자르기
                  </button>
                </nav>
              </>
            )}
          </>
        ) : (
          <>
            <img alt="thumbnail" src={url} />
            <GeneralTextField
              label="썸네일 설명"
              value={caption}
              onChange={handleThumbnailCaptionChange}
              helperText={captionMessage}
              error={captionError}
            />
            <button className={styles.button} onClick={handleThumbnailRemove}>
              썸네일 삭제
            </button>
          </>
        )}
      </div>
    </>
  );
});
