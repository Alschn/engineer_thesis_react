import { FC, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Comment } from "../../api/types";
import { useAuth } from "../../hooks/useAuth";
import usePost from "../../hooks/usePost";
import { formatDate } from "../../utils/dates";
import CommentDeleteModal from "../modals/CommentDeleteModal";
import defaultAvatar from "../../assets/avatar.jpg";

interface CommentListItemProps {
  comment: Comment;
}

const CommentListItem: FC<CommentListItemProps> = ({ comment }) => {
  const { isAuthenticated, user } = useAuth();
  const { post } = usePost();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => setIsOpenModal(true);

  const handleCloseModal = () => setIsOpenModal(false);

  const isCurrentUser = isAuthenticated && user?.username === comment.author.username;
  const formattedDate = formatDate(comment.created_at);

  return (
    <div className="d-flex flex-row gap-2">
      <div>
        <img
          src={comment.author.image || defaultAvatar}
          alt="avatar"
          height="48"
          className="rounded-circle"
        />
      </div>
      <Card className="shadow-sm rounded-4 mb-2">
        <Card.Body className="px-3 py-2">
          <Card.Title as="h5" className="d-inline">
            <Link
              to={`/profiles/${comment.author.username}`}
              className="text-decoration-none"
            >
              {comment.author.username}
            </Link>
          </Card.Title>
          <Card.Subtitle as="h6" className="d-inline-block text-muted mb-2">
            {formattedDate}
          </Card.Subtitle>
          <Card.Text>{comment.body}</Card.Text>
          {isCurrentUser && (
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentListItem;
