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
import PostAuthorMeta from "../../components/posts/PostAuthorMeta";
import PostBody from "../../components/posts/PostBody";
import TagBadge from "../../components/posts/TagBadge";
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 150px)" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (query.isError) {
    return <p className="text-danger fw-bold">Something went wrong...</p>;
  }

  if (query.isSuccess && post) {
    const isCurrentUser = isAuthenticated && user?.username === post.author.username;

    return (
      <>
        <Card className="shadow-sm rounded mb-4">
          <Card.Header className="bg-white p-0 pb-3">
            <div className="d-flex flex-column flex-lg-row gap-3">
              <img
                src={post.thumbnail}
                alt="thumbnail"
                height="300"
                className="border"
              />
              <div className="d-flex flex-column p-3">
                <Card.Title className="fs-1 mb-3">
                  Title: {post.title}
                </Card.Title>
                <Card.Subtitle className="fs-5 mb-3">
                  Description: {post.description}
                </Card.Subtitle>
                <div className="d-flex align-items-center gap-1 mb-3" style={{ fontSize: "1.1em" }}>
                  <Card.Subtitle className="fs-6">Tags:</Card.Subtitle>
                  {post.tags.map((tag) => (
                    <TagBadge label={tag.tag} color={tag.color} key={tag.slug}/>
                  ))}
                </div>
                <Card.Subtitle className="fs-5">Likes: {post.favourites_count}</Card.Subtitle>
                <div className="mb-auto"></div>
                <PostAuthorMeta
                  author={post.author}
                  createdAt={post.created_at}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 px-3">
              {isCurrentUser && !isEditing && (
                <button
                  id="post-edit"
                  className="btn btn-outline-dark"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}

              {!isCurrentUser && (
                post.is_favourited ? (
                  <button
                    id="post-unfavourite"
                    className="btn btn-outline-danger"
                    onClick={() => unfavouriteMutation.mutate()}
                    disabled={unfavouriteMutation.isLoading}
                  >
                    Remove from favourites
                  </button>
                ) : (
                  <button
                    id="post-favourite"
                    className="btn btn-outline-primary"
                    onClick={() => favouriteMutation.mutate()}
                    disabled={favouriteMutation.isLoading}
                  >
                    Add to favourites
                  </button>
                )
              )}
              {isCurrentUser && (
                <>
                  <PostDeleteModal
                    postSlug={postSlug!}
                    isOpen={isOpenDeleteModal}
                    onClose={handleCloseDeleteModal}
                  />
                  <button
                    id="post-delete"
                    className="btn btn-danger"
                    onClick={handleOpenDeleteModal}
                  >
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
