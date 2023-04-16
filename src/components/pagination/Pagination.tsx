import { FC } from "react";
import ReactPaginate, { type ReactPaginateProps } from "react-paginate";

interface PaginationProps extends Omit<ReactPaginateProps, 'pageCount' | 'onPageChange'> {
  currentPage: number,
  pagesCount: number,
  onPageChange: (page: number) => void,
}

const Pagination: FC<PaginationProps> = (
  {
    currentPage,
    pagesCount,
    onPageChange,
    ...rest
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
      {...rest}
    />
  );
};

export default Pagination;
