import { FC } from "react";
import { Card } from "react-bootstrap";
import "./PostListItemSkeleton.css";

const PostListItemSkeleton: FC = () => {
  return (
    <Card className="shadow border-0" style={{height: "100%"}}>
      <span className="placeholder placeholder-wave skeleton-image rounded-top mb-1"></span>
      <Card.Header>
        <span className="placeholder placeholder-glow skeleton-title mb-2"></span>
        <div className="d-flex flex-row align-items-center gap-2 mb-2">
          <span className="placeholder placeholder-wave skeleton-profile__image"></span>
          <div className="d-flex flex-column justify-content-center w-100 gap-1">
            <span className="placeholder placeholder-wave skeleton-profile__text"></span>
            <span className="placeholder placeholder-wave skeleton-profile__text"></span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="placeholder placeholder-wave skeleton-badge"></span>
          <span className="placeholder placeholder-wave skeleton-badge"></span>
          <span className="placeholder placeholder-wave skeleton-badge"></span>
        </div>
      </Card.Header>
      <Card.Body className="d-flex flex-column gap-2">
        <span className="placeholder placeholder-wave skeleton-profile__text w-100"></span>
        <span className="placeholder placeholder-wave skeleton-profile__text w-100"></span>
        <span className="placeholder placeholder-wave skeleton-profile__text w-75"></span>
      </Card.Body>
      <div className="d-flex justify-content-end px-3 pb-2">
        <div className="placeholder placeholder-wave skeleton-button"></div>
      </div>
    </Card>
  );
};

export default PostListItemSkeleton;
