import { Editor, EditorProps } from "@bytemd/react";
import { FC } from "react";
import plugins from "./plugins";

type MarkdownEditorProps = Omit<EditorProps, 'plugins'>;

const MarkdownEditor: FC<MarkdownEditorProps> = (props) => {
  return (
    <Editor
      plugins={plugins}
      {...props}
    />
  );
};

export default MarkdownEditor;
