import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import PostsApi, { PostsFilters } from "../../api/posts";
import { SelectOption } from "../../api/types";
import PostsFiltersModal from "../../components/modals/PostsFiltersModal";
import Pagination from "../../components/pagination/Pagination";
import PostListItem from "../../components/posts/PostListItem";
import PostListItemSkeleton from "../../components/skeletons/PostListItemSkeleton";
import useDebounce from "../../hooks/useDebounce";

const pageSizes = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 1000, label: "1000" }
] as const;

const orderingOptions = [
  { value: "created_at", label: "Created (ascending)" },
  { value: "-created_at", label: "Created (descending)" },
  { value: "updated_at", label: "Updated (ascending)" },
  { value: "-updated_at", label: "Updated (descending)" },
] as const;

const PostsList: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<SelectOption<number>>(
    pageSizes.find((o) => o.value === 50)!
  );
  const [ordering, setOrdering] = useState<SelectOption>(
    orderingOptions.find((o) => o.value === "-created_at")!
  );
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const [isOpenFiltersModal, setIsOpenFiltersModal] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState<Partial<PostsFilters>>({});

  const queryParams = {
    page,
    page_size: pageSize.value,
    ordering: ordering.value,
    search: debouncedSearch,
    ...appliedFilters,
  };

  const {
    isLoading,
    data: postsData,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["posts", queryParams],
    queryFn: ({ queryKey }) => PostsApi.getAll(queryKey[1] as PostsFilters),
  });

  const posts = useMemo(() => postsData?.data?.results || [], [postsData]);
  const total = useMemo(() => postsData?.data.count || 0, [postsData]);

  const handleOpenModal = () => setIsOpenFiltersModal(true);

  const handleCloseModal = () => setIsOpenFiltersModal(false);

  const handleApplyFilters = (filters: any) => {
    const { title, slug, author, tags, created_at__gte, created_at__lte } = filters;
    const activeFilters = {
      title__icontains: title,
      slug__icontains: slug,
      author__user__username__icontains: author.join(","),
      tags__tag__icontains: tags.join(","),
      created_at__gte: created_at__gte,
      created_at__lte: created_at__lte,
    };
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(activeFilters).filter(([_, value]) => !!value)
    );
    if (Object.keys(nonEmptyFilters).length) {
      setAppliedFilters(nonEmptyFilters as Partial<PostsFilters>);
    } else {
      // set default values
      // todo: refactor this, maybe use reducer here
      setPage(1);
      setPageSize({ value: 10, label: "10" });
      setOrdering(orderingOptions.find((o) => o.value === "-created_at")!);
      setSearch("");
      // clear filters
      setAppliedFilters({});
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Explore posts</h1>
        <Link to="/posts/add" className="btn btn-primary">Add Post</Link>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 mb-3">
        <div className="flex-grow-1">
          <label htmlFor="search" className="form-label">Search</label>
          <input
            id="search"
            name="search"
            type="search"
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
            onChange={(newValue) => setOrdering(newValue as SelectOption)}
          />
        </div>
        <div>
          <label htmlFor="page_size" className="form-label">Page Size</label>
          <Select
            id="page_size"
            name="page_size"
            isClearable={false}
            isSearchable={false}
            options={pageSizes}
            value={pageSize}
            onChange={(newValue) => setPageSize(newValue as SelectOption<number>)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <PostsFiltersModal
          isOpen={isOpenFiltersModal}
          onClose={handleCloseModal}
          onConfirm={handleApplyFilters}
        />
        <button
          className="btn btn-outline-primary"
          onClick={handleOpenModal}
        >
          Open Filters
        </button>
      </div>

      <article className="row gy-4 mb-3">
        {isLoading && Array.from(Array(6)).map((_, i) => (
          <div className="col col-md-6 col-xl-4" key={`post-skeleton-${i}`}>
            <PostListItemSkeleton/>
          </div>
        ))}

        {isError && (
          <p className="text-danger fw-bold">Something went wrong...</p>
        )}

        {isSuccess && (
          <>
            {total > 0 ? (
              posts.map((post) => (
                <div className="col col-md-6 col-xl-4" key={`post-${post.id}`}>
                  <PostListItem post={post}/>
                </div>
              ))
            ) : (
              <p className="fw-bold">No posts found...</p>
            )}

            {total > 0 && (
              <nav className="card-footer p-0 mb-3">
                <Pagination
                  currentPage={page}
                  pagesCount={Math.ceil(total / pageSize.value)}
                  onPageChange={setPage}
                />
              </nav>
            )}
          </>
        )}
      </article>
    </>
  );
};

export default PostsList;
