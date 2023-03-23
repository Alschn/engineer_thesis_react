import { FC, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Comment } from "../../api/types";
import { useAuth } from "../../hooks/useAuth";
import usePost from "../../hooks/usePost";
import CommentDeleteModal from "../modals/CommentDeleteModal";

interface CommentListItemProps {
  comment: Comment;
}

const CommentListItem: FC<CommentListItemProps> = ({ comment }) => {
  const { isAuthenticated, user } = useAuth();
  const { post } = usePost();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => setIsOpenModal(true);

  const handleCloseModal = () => setIsOpenModal(false);

  const createdAt = new Date(comment.created_at);

  return (
    <Card className="mb-2">
      <Card.Body className="px-3 py-2">
        <Card.Title className="d-inline">
          <Link
            to="/profiles/{comment.author.username}"
            className="text-decoration-none"
          >
            {comment.author.username}
          </Link>
          <Card.Subtitle className="d-inline-block text-muted mb-2">
            {createdAt.toLocaleString()}
          </Card.Subtitle>
          <Card.Text>{comment.body}</Card.Text>
          {isAuthenticated && user?.username === comment.author.username && (
            <>
              <CommentDeleteModal
                isOpen={isOpenModal}
                onClose={handleCloseModal}
                postSlug={post.slug}
                commentId={comment.id}
              />
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleOpenModal}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default CommentListItem;
