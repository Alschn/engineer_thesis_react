import { FC } from "react";

const PageNotFound: FC = () => {
  return (
    <div className="d-flex flex-col justify-content-center align-items-center vh-100">
      <div className="flex-col text-center">
        <h1>404</h1>
        <p className="fs-2">Page not found</p>
      </div>
    </div>
  );
};

export default PageNotFound;
