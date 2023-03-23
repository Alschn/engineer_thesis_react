import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, ModalTitle } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostsApi from "../../api/posts";

interface PostDeleteModalProps extends ModalProps {
  postSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

const PostDeleteModal: FC<PostDeleteModalProps> = (
  {
    postSlug,
    isOpen,
    onClose,
    ...rest
  }
) => {
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => PostsApi.deletePost(postSlug),
    onSuccess: () => {
      onClose();
      toast.success("Post deleted");
      navigate("posts");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Failed to delete comment...');
        return;
      }

      toast.error('Something went wrong...');
    },
  });

  const handleDelete = () => deleteMutation.mutate();

  return (
    <Modal show={isOpen} onHide={onClose} {...rest}>
      <ModalHeader closeButton>
        <ModalTitle>Delete Post {postSlug}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className="fs-5">Are you sure you want to delete this post?</p>
        <p className="fs-5">This action is irreversible!</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default PostDeleteModal;
