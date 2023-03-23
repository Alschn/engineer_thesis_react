import { FC } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number,
  pagesCount: number,
  onPageChange: (page: number) => void,
}

const Pagination: FC<PaginationProps> = (
  {
    currentPage,
    pagesCount,
    onPageChange
  }
) => {
  return (
    <ReactPaginate
      previousLabel="&#8249;"
      nextLabel="&#8250;"
      breakLabel="..."
      forcePage={currentPage - 1}
      pageCount={pagesCount}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      // pageRangeDisplayed={4}
      // marginPagesDisplayed={2}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
    />
  );
};

export default Pagination;
