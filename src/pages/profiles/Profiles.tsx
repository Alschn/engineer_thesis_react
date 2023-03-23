import { useQuery } from "@tanstack/react-query";
import React, { FC, useMemo, useState } from "react";
import Select from "react-select";
import ProfilesApi, { ProfilesFilters } from "../../api/profiles";
import { SelectOption } from "../../api/types";
import Pagination from "../../components/pagination/Pagination";
import ProfileListItem from "../../components/profiles/ProfileListItem";
import useDebounce from "../../hooks/useDebounce";

const pageSizes = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const Profiles: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<SelectOption<number>>({ value: 20, label: "20" });
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const queryParams = {
    page,
    page_size: pageSize.value,
    username__icontains: debouncedSearch,
  };

  const query = useQuery({
    queryKey: ["profiles", queryParams],
    queryFn: ({ queryKey }) => ProfilesApi.getAll(queryKey[1] as ProfilesFilters),
  });

  const profiles = useMemo(() => query.data?.data.results ?? [], [query]);
  const total = useMemo(() => query.data?.data.count ?? 0, [query]);

  return (
    <article className="mb-3">
      <header className="d-flex flex-column gap-2 mb-3">
        <h1>Profiles</h1>
        <div className="d-flex gap-2">
          <div className="flex-grow-1">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              id="search"
              name="search"
              className="form-control"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="page_size" className="form-label">Page Size</label>
            <Select
              id="page_size"
              name="page_size"
              isSearchable={false}
              isClearable={false}
              options={pageSizes}
              value={pageSize}
              onChange={(newValue) => setPageSize(newValue as SelectOption<number>)}
            />
          </div>
        </div>
      </header>
      <section>
        {query.isLoading && (
          <p>Loading...</p>
        )}
        {query.isError && (
          <p>Something went wrong...</p>
        )}
        {query.isSuccess && (
          <div className="row row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <div className="gy-3" key={`profile-${profile.id}`}>
                  <ProfileListItem profile={profile}/>
                </div>
              ))
            ) : (
              <p>No profiles found.</p>
            )}
          </div>
        )}
      </section>
      {total > 0 && (
        <nav className="card-footer p-0">
          <Pagination
            currentPage={page}
            pagesCount={Math.ceil(total / pageSize.value)}
            onPageChange={setPage}
          />
        </nav>
      )}
    </article>
  );
};

export default Profiles;
