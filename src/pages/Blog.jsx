/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import blogAPI from "../api/blog";
import toast from "react-hot-toast";

function Blog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState("loading");
  const navigate = useNavigate();
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
    <div className="overflow-y-auto px-4">
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
          <p className="mx-auto mt-4 flex w-[75%] justify-between text-sm">
            <p>Published By : {blog.author.username}</p>
            <p>Published On : {new Date(blog.createdAt).toLocaleString()}</p>
          </p>
          <p className="mt-4 mb-6 px-5 text-justify leading-loose text-gray-500">
            {blog.content}
          </p>
        </>
      )}
    </div>
  );
}

export default Blog;
