import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";
import PageNotFound from "../pages/404";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PostsAdd from "../pages/posts/PostsAdd";
import PostsDetail from "../pages/posts/PostsDetail";
import PostsFeed from "../pages/posts/PostsFeed";
import PostsList from "../pages/posts/PostsList";
import Profiles from "../pages/profiles/Profiles";
import ProfilesDetail from "../pages/profiles/ProfilesDetail";
import ProtectedRoute from "./ProtectedRoute";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/posts"/>}/>

        <Route path="auth" element={<AuthLayout/>}>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
        </Route>

        <Route
          path="posts"
          element={<MainLayout/>}
        >
          <Route path="" element={<PostsList/>}/>
          <Route path=":postSlug" element={<PostsDetail/>}/>
        </Route>

        <Route
          path=""
          element={
            <ProtectedRoute>
              <MainLayout/>
            </ProtectedRoute>
          }
        >
          <Route path="posts/feed" element={<PostsFeed/>}/>
          <Route path="posts/add" element={<PostsAdd/>}/>
        </Route>

        <Route
          path="profiles"
          element={<MainLayout/>}
        >
          <Route path="" element={<Profiles/>}/>
          <Route path=":username" element={<ProfilesDetail/>}/>
        </Route>

        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
