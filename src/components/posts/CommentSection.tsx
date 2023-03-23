import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { FC, FormEvent, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import PostsApi, { PostCommentsFilters } from "../../api/posts";
import { SelectOption } from "../../api/types";
import usePost from "../../hooks/usePost";
import CommentAddForm from "../forms/CommentAddForm";
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
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.next;
      if (!nextPage) return undefined;
      const url = new URL(nextPage);
      const parsed = parseInt(url.searchParams.get("page")!);
      return !isNaN(parsed) ? parsed : undefined;
    }
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
    <Card className="mb-3">
      <Card.Header>
        <Card.Title>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {commentsQuery.isLoading && (
                <p>Loading...</p>
              )}
              {commentsQuery.isSuccess && (
                <p>Comments ({totalComments}):</p>
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
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-2">
        {commentsQuery.isLoading && (
          <p>Loading comments...</p>
        )}
        {commentsQuery.isError && (
          <p>Something went wrong...</p>
        )}
        {commentsQuery.isSuccess && comments.map((comment) => (
          <CommentListItem comment={comment} key={`comment-${comment.id}`}/>
        ))}
        {commentsQuery.hasNextPage && (
          <button className="btn btn-outline-primary" onClick={() => commentsQuery.fetchNextPage}>
            Load more...
          </button>
        )}
        {commentsQuery.isFetchingNextPage && (
          <p>Loading more comments...</p>
        )}
        <CommentAddForm
          value={commentBody}
          isSubmitting={commentSubmitLocked || addCommentMutation.isLoading}
          onClear={() => setCommentBody("")}
          onChange={setCommentBody}
          onSubmit={handleCommentSubmit}
        />
      </Card.Body>
    </Card>
  );
};

export default CommentSection;
