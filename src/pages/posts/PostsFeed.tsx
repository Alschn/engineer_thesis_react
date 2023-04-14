import { useInfiniteQuery } from "@tanstack/react-query";
import { FC, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import PostsApi, { PostsFilters, PostsOrdering } from "../../api/posts";
import { SelectOption } from "../../api/types";
import PostListItem from "../../components/posts/PostListItem";
import useDebounce from "../../hooks/useDebounce";
import { getNextPageParam } from "../../utils/tanstack-query";

const orderingOptions = [
  { value: "created_at", label: "Created (ascending)" },
  { value: "-created_at", label: "Created (descending)" },
  { value: "updated_at", label: "Updated (ascending)" },
  { value: "-updated_at", label: "Updated (descending)" },
];

const PostsFeed: FC = () => {
  const [ordering, setOrdering] = useState<SelectOption>(
    { value: "-created_at", label: "Created (descending)" }
  );
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const queryParams: PostsFilters = useMemo(() => {
    return {
      ordering: ordering.value as PostsOrdering,
      search: debouncedSearch,
    };
  }, [ordering, search]);

  const query = useInfiniteQuery({
    queryKey: ["posts", queryParams],
    queryFn: ({ queryKey, pageParam = 1 }) => PostsApi.getFeed({
      ...(queryKey[1] as PostsFilters),
      page: pageParam,
      page_size: 10
    } as PostsFilters),
    getNextPageParam: getNextPageParam
  });

  const posts = useMemo(() => {
    return query.data?.pages.flatMap(page => page.data.results) ?? [];
  }, [query.data]);

  useEffect(() => {
    const listener = (e: Event) => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) return;
      if (!query.hasNextPage || query.isFetchingNextPage) return;
      query.fetchNextPage().then();
    };

    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Your feed</h1>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 mb-3">
        <div className="flex-grow-1">
          <label htmlFor="search" className="form-label">Search</label>
          <input
            id="search"
            name="search"
            className="form-control"
            placeholder="Type to search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ordering" className="form-label">Ordering</label>
          <Select
            id="ordering"
            name="ordering"
            isClearable={false}
            isSearchable={false}
            options={orderingOptions}
            value={ordering}
            onChange={(value) => setOrdering(value as SelectOption)}
          />
        </div>
      </div>

      {query.isLoading && (
        <p>Loading...</p>
      )}

      {query.isError && (
        <p>Something went wrong...</p>
      )}

      {query.isSuccess && (
        <>
          <div className="d-flex flex-column gap-3">
            {posts.map(post => (
              <PostListItem post={post} key={`post-list-item-${post.id}`}/>
            ))}
          </div>

          {query.isFetchingNextPage && (
            <h4 className="my-2">Loading more...</h4>
          )}

          {!query.hasNextPage && (
            <h4 className="my-2">No more posts...</h4>
          )}
        </>
      )}
    </>
  );
};

export default PostsFeed;
