import { FC } from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "../navbar/Navbar";

const MainLayout: FC = () => {
  return (
    <>
      <MainNavbar/>

      <main className="container mt-3">
        <Outlet/>
      </main>
    </>
  );
};

export default MainLayout;
