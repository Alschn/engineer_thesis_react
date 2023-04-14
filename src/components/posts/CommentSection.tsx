import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { FC, FormEvent, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import PostsApi, { PostCommentsFilters } from "../../api/posts";
import { SelectOption } from "../../api/types";
import usePost from "../../hooks/usePost";
import { getNextPageParam } from "../../utils/tanstack-query";
import CommentAddForm from "../forms/CommentAddForm";
import CommentListItemSkeleton from "../skeletons/CommentListItemSkeleton";
import CommentListItem from "./CommentListItem";

const commentsOrderingItems = [
  { label: "Sort by: Newest", value: "-created_at" },
  { label: "Sort by: Oldest", value: "created_at" },
];

const CommentSection: FC = () => {
  const { post } = usePost();
  const [commentsOrdering, setCommentsOrdering] = useState({ value: "-created_at", label: "Sort by: Newest" });
  const [commentBody, setCommentBody] = useState("");
  const [commentSubmitLocked, setCommentSubmitLocked] = useState(false);

  const params = {
    ordering: commentsOrdering.value,
    page_size: 10
  };

  const commentsQuery = useInfiniteQuery({
    queryKey: ["posts", post.slug, "comments", params],
    queryFn: ({ queryKey, pageParam = 1 }) => PostsApi.getAllComments(
      queryKey[1] as string, { page: pageParam, ...queryKey[3] as PostCommentsFilters }
    ),
    getNextPageParam: getNextPageParam
  });

  const comments = useMemo(() => {
    return commentsQuery.data?.pages.flatMap(page => page.data.results) || [];
  }, [commentsQuery]);

  const totalComments = useMemo(() => {
    return commentsQuery.data?.pages[0]?.data.count || 0;
  }, [commentsQuery]);

  const addCommentMutation = useMutation({
    mutationFn: (body: string) => PostsApi.addComment(post.slug, body),
    onSuccess: () => {
      toast.success("Comment added");
      setCommentBody("");
      setCommentSubmitLocked(true);
      setTimeout(() => {
        setCommentSubmitLocked(false);
      }, 1000);
      commentsQuery.refetch().then();
    },
    onError: (error) => {
      toast.error('Something went wrong...');
    }
  });

  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCommentMutation.mutate(commentBody);
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="bg-white">
        <div className="d-flex align-items-center pt-1">
          <div className="flex-grow-1">
            {commentsQuery.isLoading && (
              <p className="placeholder placeholder-glow"></p>
            )}
            {commentsQuery.isSuccess && (
              <Card.Title>Comments ({totalComments}):</Card.Title>
            )}
          </div>

          <div style={{ minWidth: "200px" }}>
            <Select
              id="comments_ordering"
              name="comments_ordering"
              isClearable={false}
              isSearchable={false}
              options={commentsOrderingItems}
              value={commentsOrdering}
              onChange={(newValue => setCommentsOrdering(newValue as SelectOption))}
            />
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-2">
        {commentsQuery.isLoading && (
          <div className="d-flex flex-column gap-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <CommentListItemSkeleton key={`comment-skeleton-${i}`}/>
            ))}
          </div>
        )}
        {commentsQuery.isError && (
          <p className="text-danger fw-bold">Something went wrong...</p>
        )}
        {commentsQuery.isSuccess && (
          <div className="d-flex flex-column gap-2 p-2">
            {comments.map((comment) => (
              <CommentListItem comment={comment} key={`comment-${comment.id}`}/>
            ))}
          </div>
        )}
        {commentsQuery.hasNextPage && (
          <button
            id="comments-load-more"
            className="btn btn-outline-primary"
            onClick={() => commentsQuery.fetchNextPage}
            disabled={commentsQuery.isFetchingNextPage}
          >
            Load more...
          </button>
        )}
        {commentsQuery.isFetchingNextPage && (
          <p className="fw-bold">Loading more comments...</p>
        )}

        <CommentAddForm
          isSubmitting={commentSubmitLocked || addCommentMutation.isLoading}
          onClear={() => setCommentBody("")}
          value={commentBody}
          onChange={setCommentBody}
          onSubmit={handleCommentSubmit}
        />
      </Card.Body>
    </Card>
  );
};

export default CommentSection;
