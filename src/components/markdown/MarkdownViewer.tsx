import { Viewer, ViewerProps } from "@bytemd/react";
import { FC } from "react";
import plugins from "./plugins";

type MarkdownViewerProps = Omit<ViewerProps, 'plugins'>;

const MarkdownViewer: FC<MarkdownViewerProps> = (props) => {
  return (
    <Viewer
      plugins={plugins}
      {...props}
    />
  );
};

export default MarkdownViewer;
