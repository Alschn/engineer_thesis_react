import { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
  return (
    <main className="d-flex vh-100 justify-content-center align-items-center">
      <Outlet/>
    </main>
  );
};

export default AuthLayout;
