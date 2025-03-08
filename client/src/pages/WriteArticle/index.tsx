import styles from "./styles.module.scss";
import "./styles.scss";

import { TextFieldChangeEvent } from "@/types/mui";
import { GeneralTextField } from "@components/GeneralTextField";
import { QuillEditor } from "@components/QuillEditor";
import { ThumbnailInput, ThumbnailRef } from "@components/ThumbnailInput";
import { CategoryContext } from "@contexts/category-context";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  getArticle,
  patchArticle,
  postArticle,
} from "@services/article-service";
import { postImage } from "@services/image-service";
import { renderBlobToCanvas } from "@utils/rander-blob-to-canvas";
import Quill, { Module } from "quill";
import { BaseTooltip } from "quill/themes/base";
import SnowTheme from "quill/themes/snow";
import {
  FC,
  FormEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function quillImageHandler(this: Module) {
  const quill = this.quill;
  const theme = quill.theme as SnowTheme;
  const tooltip = theme.tooltip! as BaseTooltip;
  const { save: originalSave, hide: originalHide } = tooltip;
  const textbox = tooltip.textbox!;
  tooltip.edit(`image`);
  textbox.placeholder = `Image URL`;
  const container = tooltip.root;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "block";
  input.onchange = async (_: Event) => {
    const file = input.files!.item(0);
    input.files = null;
    if (file === null) {
      return;
    }
    try {
      const canvas = await renderBlobToCanvas(file);
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
      const { url } = await postImage(blob);
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, `image`, url, `user`);
    } catch {
      alert("이미지 업로드 실패");
    }
  };
  container.appendChild(input);
  tooltip.save = function () {
    const range = quill.getSelection(true);
    const value = textbox.value;
    if (value) {
      quill.insertEmbed(range.index, `image`, value, `user`);
    }
  };
  tooltip.hide = function () {
    tooltip.save = originalSave;
    tooltip.hide = originalHide;
    container.removeChild(input);
    tooltip.hide();
  };
}

const quillModules = {
  toolbar: {
    container: [
      { font: [] },
      { header: [false, 1, 2, 3, 4, 5, 6] },
      { size: [`small`, false, `large`, `huge`] },
      `bold`,
      `italic`,
      `underline`,
      `strike`,
      `blockquote`,
      `code-block`,
      `link`,
      `image`,
      `video`,
      `formula`,
      { list: `ordered` },
      { list: `bullet` },
      { list: `check` },
      { script: `sub` },
      { script: `super` },
      { indent: `-1` },
      { indent: `+1` },
      { color: [] },
      { background: [] },
      { align: [] },
      `clean`,
    ],
    handlers: {
      image: quillImageHandler,
    },
  },
};

export const WriteArticle: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categories = useContext(CategoryContext);

  const [override, setOverride] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [thumbnailCaptionMessage, setThumbnailCaptionMessage] = useState<
    string | null
  >(null);
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [subtitleMessage, setSubtitleMessage] = useState<string | null>(null);

  const thumbnailRef = useRef<ThumbnailRef>(null);
  const quillRef = useRef<Quill>(null);

  useEffect(() => {
    const raw = searchParams.get("override");
    if (raw === null) {
      return;
    }

    const override = parseInt(raw);
    if (isNaN(override) || override < 0) {
      return;
    }

    setOverride(override);

    (async () => {
      const article = await getArticle(override);
      thumbnailRef.current!.setName(article.thumbnail?.name ?? null);
      thumbnailRef.current!.setCaption(article.thumbnail?.caption ?? "");
      setCategory(article.category ?? "");
      setTitle(article.title);
      setSubtitle(article.subtitle);
      quillRef.current!.setContents(JSON.parse(article.content).ops);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const handleSubmit = useCallback(async () => {
    const thumbnail = thumbnailRef.current;
    const quill = quillRef.current!;
    const content = JSON.stringify(quill.getContents());
    const payload = {
      category: category.length > 0 ? category : null,
      title,
      subtitle,
      thumbnail:
        thumbnail !== null && thumbnail.name !== null
          ? {
              name: thumbnail.name,
              caption: thumbnail.caption,
            }
          : null,
      content,
    };
    try {
      if (override === null) {
        const { uid } = await postArticle(payload);
        navigate(`/article/${uid}`);
      } else {
        await patchArticle(override, payload);
        navigate(`/article/${override}`);
      }
    } catch (error: any) {
      const details = error?.details;
      if (details) {
        const categoryError = details?.fieldErrors?.category?.errorMessage;
        if (typeof categoryError === "string") {
          alert("카테고리가 존재하지 않습니다. 페이지를 새로고침해주세요");
          return;
        }
        const titleError = details?.fieldErrors?.title?.errorMessage;
        if (typeof titleError === "string") {
          setTitleMessage(titleError);
          return;
        }
        const subtitleError = details?.fieldErrors?.subtitle?.errorMessage;
        if (typeof subtitleError === "string") {
          setSubtitleMessage(subtitleError);
          return;
        }
        const captionError =
          details?.fieldErrors?.thumbnail?.fieldErrors?.caption?.errorMessage;
        if (typeof captionError === "string") {
          setThumbnailCaptionMessage(captionError);
          return;
        }
        const contentError = details?.fieldError?.content?.errorMessage;
        if (typeof contentError === "string") {
          alert(contentError);
          return;
        }
      }
      alert("알 수 없는 오류가 발생하였습니다");
    }
  }, [category, title, subtitle, override, navigate]);

  const handleCategoryChange = useCallback(
    (_: MouseEvent<HTMLElement>, value: any) => {
      if (value !== null) {
        setCategory(value);
      }
    },
    []
  );

  const handleTitleChange = useCallback(({ target }: TextFieldChangeEvent) => {
    setTitle(target.value);
    setTitleMessage(null);
  }, []);

  const handleSubtitleChange = useCallback(
    ({ target }: TextFieldChangeEvent) => {
      setSubtitle(target.value);
      setSubtitleMessage(null);
    },
    []
  );

  return (
    <>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <ThumbnailInput
          ref={thumbnailRef}
          captionMessage={thumbnailCaptionMessage}
          captionError={thumbnailCaptionMessage !== null}
        />
        {categories !== undefined ? (
          <ToggleButtonGroup
            value={category}
            onChange={handleCategoryChange}
            exclusive
          >
            <ToggleButton value={""}>카테고리 없음</ToggleButton>
            {categories.map(({ name: category }) => (
              <ToggleButton key={category} value={category}>
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        ) : (
          <div className={styles["category-select-loading"]} />
        )}

        <GeneralTextField
          label="제목"
          value={title}
          onChange={handleTitleChange}
          helperText={titleMessage}
          error={titleMessage !== null}
        />
        <GeneralTextField
          label="부제목"
          value={subtitle}
          onChange={handleSubtitleChange}
          helperText={subtitleMessage}
          error={subtitleMessage !== null}
        />
        <QuillEditor
          ref={quillRef}
          theme="snow"
          mode="write"
          placeholder="여기에 기사 본문 작성"
          modules={quillModules}
        />
        <button
          className={styles["submit-button"]}
          type="submit"
          onClick={handleSubmit}
        >
          게시
        </button>
      </form>
    </>
  );
};
