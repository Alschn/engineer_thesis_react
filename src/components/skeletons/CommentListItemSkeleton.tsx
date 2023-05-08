import { FC } from "react";
import { Card } from "react-bootstrap";
import "./CommentListItemSkeleton.css";

const CommentListItemSkeleton: FC = () => {
  return (
    <div className="d-flex flex-row gap-2">
      <div className="placeholder placeholder-image"></div>
      <Card className="shadow-sm rounded-4 mb-2">
        <Card.Body className="px-3 py-2">
          <span className="placeholder placeholder-author"></span>
          <span className="d-inline-block placeholder placeholder-date"></span>
          <span className="d-block placeholder placeholder-content"></span>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentListItemSkeleton;
