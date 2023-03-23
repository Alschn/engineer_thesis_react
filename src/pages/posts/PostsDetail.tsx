import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, useState } from "react";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PostsApi, { PostUpdatePayload } from "../../api/posts";
import PostDeleteModal from "../../components/modals/PostDeleteModal";
import CommentSection from "../../components/posts/CommentSection";
import PostBody from "../../components/posts/PostBody";
import { PostContext } from "../../context/PostContext";
import { useAuth } from "../../hooks/useAuth";

const PostsDetail: FC = () => {
  const { postSlug } = useParams();
  const { isAuthenticated, user } = useAuth();

  const navigate = useNavigate();
  const client = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleOpenDeleteModal = () => setIsOpenDeleteModal(true);

  const handleCloseDeleteModal = () => setIsOpenDeleteModal(false);

  const query = useQuery({
    queryKey: ["posts", postSlug],
    queryFn: ({ queryKey }) => PostsApi.getPost(queryKey[1] as string),
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error('The post you are looking for does not exist.');
        navigate("/posts");
      }
    },
    retry: (failureCount, error) => {
      // @ts-ignore
      return error?.response?.status !== 404;
    }
  });

  const post = query.data?.data || null;

  const updatePostMutation = useMutation({
    mutationFn: (data: PostUpdatePayload) => PostsApi.updatePost(postSlug!, data),
    onSuccess: ({ data }) => {
      toast.success("Post updated");
      setIsEditing(false);
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({ ...old, data: { ...old.data, body: data.body } })
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Failed to update post...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const favouriteMutation = useMutation({
    mutationFn: () => PostsApi.addToFavourites(postSlug!),
    onSuccess: ({ data }) => {
      toast.success("Post added to favourites");
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({
          ...old, data: {
            ...old.data,
            is_favourited: true,
            favourites_count: data.favourites_count
          }
        })
      );
    },
    onError: (error) => {
      toast.error('Something went wrong...');
    }
  });

  const unfavouriteMutation = useMutation({
    mutationFn: () => PostsApi.removeFromFavourites(postSlug!),
    onSuccess: ({ data }) => {
      toast.success("Post removed from favourites");
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({
          ...old,
          data: {
            ...old.data,
            is_favourited: false,
            favourites_count: data.favourites_count
          }
        })
      );
    },
    onError: (error) => {
      toast.error('Something went wrong...');
    }
  });

  const handlePostUpdate = (newBody: string) => {
    updatePostMutation.mutate({ body: newBody });
  };


  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Something went wrong...</div>;
  }

  if (query.isSuccess && post) {
    return (
      <>
        <Card className="mb-3">
          <Card.Header>
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle className="mb-1">Description: {post.description}</Card.Subtitle>
            <div className="mb-2">
              <Link to={`/profiles/${post.author.username}`}>
                Author: {post.author.username}
              </Link>
            </div>
            <div className="d-flex gap-1 mb-2" style={{ fontSize: "1.1em" }}>
              {post.tags.map((tag) => (
                <span className="badge bg-primary" key={`tag-${tag}`}>{tag}</span>
              ))}
            </div>
            <p>Likes: {post.favourites_count}</p>
            <div className="d-flex justify-content-end gap-2">
              {isAuthenticated && !isEditing && post.author.username === user!.username && (
                <button className="btn btn-outline-dark" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
              {isAuthenticated && post.author.username !== user!.username && (
                post.is_favourited ? (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => unfavouriteMutation.mutate()}
                    disabled={unfavouriteMutation.isLoading}
                  >
                    Remove from favourites
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => favouriteMutation.mutate()}
                    disabled={favouriteMutation.isLoading}
                  >
                    Add to favourites
                  </button>
                )
              )}
              {isAuthenticated && post.author.username === user?.username && (
                <>
                  <PostDeleteModal
                    postSlug={post.slug}
                    isOpen={isOpenDeleteModal}
                    onClose={handleCloseDeleteModal}
                  />
                  <button className="btn btn-danger" onClick={handleOpenDeleteModal}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </Card.Header>
          <PostBody
            body={post.body}
            handleCancelEdit={() => setIsEditing(false)}
            isEditing={isEditing}
            handlePostUpdate={handlePostUpdate}
          />
        </Card>
        <PostContext.Provider value={{ post }}>
          <CommentSection/>
        </PostContext.Provider>
      </>
    );
  }

  return null;
};

export default PostsDetail;
