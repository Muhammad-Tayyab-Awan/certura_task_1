/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import blogAPI from "../api/blog";
import toast from "react-hot-toast";
import { useLoginContext } from "../context/LoginContext";

function Blog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState("loading");
  const navigate = useNavigate();
  const { loggedIn, username } = useLoginContext();
  useEffect(() => {
    blogAPI.get_blog_by_id(blogId).then((response) => {
      if (!response.resStatus) {
        toast.error(response.message);
        navigate("/not-found");
        return;
      }
      setBlog(response.blog);
      document.title = response.blog.title.trim();
    });
  }, [blogId]);
  return (
    <div className="overflow-y-auto px-1 sm:px-4">
      {blog === "loading" && (
        <h1 className="col-span-4 mt-20 animate-pulse text-center text-xl font-medium text-gray-500">
          Loading...
        </h1>
      )}
      {blog !== "loading" && (
        <>
          <h1 className="mt-4 text-center text-2xl font-medium">
            {blog.title}
          </h1>
          <img
            src={blog.coverImageURL}
            alt={blog.title.trim().toLowerCase().replaceAll(" ", "-")}
            className="mt-4 w-full rounded-md"
          />
          <p className="mx-auto mt-4 flex w-[75%] flex-col items-start justify-center gap-1 text-xs sm:flex-row sm:justify-between sm:gap-0 sm:text-sm">
            <span>Published By : {blog.author.username}</span>
            {loggedIn && username === blog.author.username ? (
              <button
                className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-white focus-visible:outline-hidden disabled:animate-pulse disabled:cursor-progress"
                onClick={async (e) => {
                  e.target.disabled = true;
                  const response = await blogAPI.delete_blog_by_id(blogId);
                  e.target.disabled = false;
                  if (!response.resStatus) {
                    toast.error(response.message);
                    return;
                  }
                  toast.success(response.message);
                  navigate("/my-blogs");
                }}
              >
                Delete
              </button>
            ) : (
              <></>
            )}
            <span>
              Published On : {new Date(blog.createdAt).toLocaleString()}
            </span>
          </p>
          <p className="mt-4 mb-6 px-1 text-justify leading-loose text-gray-500 sm:px-5">
            {blog.content}
          </p>
        </>
      )}
    </div>
  );
}

export default Blog;
