import { createContext } from "react";
import { Post } from "../api/types";

interface PostContextValues {
  post: Post;
}

export const PostContext = createContext({} as PostContextValues);
