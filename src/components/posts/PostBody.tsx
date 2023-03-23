import React, { FC, Fragment, useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import MarkdownEditor from "../markdown/MarkdownEditor";
import MarkdownViewer from "../markdown/MarkdownViewer";

interface PostBodyProps {
  isEditing: boolean;
  handlePostUpdate: (newBody: string) => void;
  handleCancelEdit: () => void;
  body: string;
}

const PostBody: FC<PostBodyProps> = (
  {
    isEditing = false,
    handlePostUpdate,
    handleCancelEdit,
    body,
  }
) => {
  const [bodyDraft, setBodyDraft] = useState<string>(body);
  const handleChange = (newValue: string) => setBodyDraft(newValue);
  const handleSave = () => handlePostUpdate(bodyDraft);

  useLayoutEffect(() => {
    if (!isEditing) {
      setBodyDraft(body);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Fragment>
        <MarkdownEditor
          value={bodyDraft}
          onChange={handleChange}
        />
        <div className="d-flex justify-content-end p-2 gap-2 mr-2">
          <button className="btn btn-outline-dark" type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </Fragment>
    );
  }

  return (
    <Card.Body>
      <MarkdownViewer value={body}/>
    </Card.Body>
  );
};

export default PostBody;
