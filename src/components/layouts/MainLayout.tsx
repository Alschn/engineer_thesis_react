import { FC } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const MainLayout: FC = () => {
  return (
    <>
      <Navbar/>

      <main className="container mt-3">
        <Outlet/>
      </main>
    </>
  );
};

export default MainLayout;
