import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { Button, Modal, ModalProps } from "react-bootstrap";
import { toast } from "react-toastify";
import PostsApi from "../../api/posts";

interface CommentDeleteModalProps extends ModalProps {
  postSlug: string;
  commentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CommentDeleteModal: FC<CommentDeleteModalProps> = (
  {
    postSlug,
    commentId,
    isOpen,
    onClose,
    ...rest
  }
) => {
  const client = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => PostsApi.deleteComment(postSlug, commentId),
    onSuccess: async () => {
      await client.refetchQueries(["posts", postSlug, "comments"]);
      toast.success("Comment deleted");
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.message);
        return;
      }

      toast.error('Something went wrong...');
    },
  });

  const handleDelete = () => deleteMutation.mutate();

  return (
    <Modal show={isOpen} onHide={onClose} {...rest}>
      <Modal.Header>
        <Modal.Title>Comment Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fs-5">Are you sure you want to delete this comment?</p>
        <p className="fs-5">This action is irreversible!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentDeleteModal;
