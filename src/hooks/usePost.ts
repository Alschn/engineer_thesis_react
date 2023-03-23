import { useContext } from "react";
import { PostContext } from "../context/PostContext";

const usePost = () => useContext(PostContext);

export default usePost;
