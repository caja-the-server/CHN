import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

import "katex";
import Quill, { QuillOptions } from "quill";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Props = {
  theme: "snow" | "bubble";
  mode: "read" | "write";
  modules?: QuillOptions["modules"];
  placeholder?: QuillOptions["placeholder"];
  formats?: QuillOptions["formats"];
};

export const QuillEditor = forwardRef<Quill | null, Props>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const containerDocument = container.ownerDocument;
    const editorWrapper = container.appendChild(
      containerDocument.createElement("div")
    );
    const editorContainer = editorWrapper.appendChild(
      containerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: props.theme,
      modules: props.modules,
      placeholder: props.placeholder,
      formats: props.formats,
    });
    setQuillInstance(quill);
    return () => {
      editorWrapper.remove();
    };
  }, [props.theme, props.modules, props.placeholder, props.formats]);

  useImperativeHandle<Quill | null, Quill | null>(
    ref,
    () => {
      return quillInstance;
    },
    [quillInstance]
  );

  useEffect(() => {
    if (quillInstance === undefined) {
      return;
    }
    const mode = props.mode;
    switch (mode) {
      case "read":
        quillInstance?.enable(false);
        return;
      case "write":
        quillInstance?.enable(true);
        return;
    }
    mode satisfies never;
  }, [quillInstance, props.mode]);

  return <div ref={containerRef} spellCheck="false" />;
});
