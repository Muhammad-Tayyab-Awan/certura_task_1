/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useLoginContext } from "../context/LoginContext";
import blogAPI from "../api/blog";
import toast from "react-hot-toast";
import BlogCard from "../components/Blog/BlogCard";

function MyBlogs() {
  const navigate = useNavigate();

  const { loggedIn } = useLoginContext();

  const [blogs, setBlogs] = useState("loading");

  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    } else if (loggedIn === true) {
      document.title = "My Blogs";
      blogAPI.get_my_blogs().then((response) => {
        if (!response.resStatus) {
          toast.error(response.message);
          return;
        }
        setBlogs(response.myBlogs.length > 0 ? response.myBlogs : null);
      });
    }
  }, [loggedIn]);

  return (
    <>
      <div className="h-[80svh] w-full overflow-y-auto bg-[url('/blog1.jpg')] bg-cover bg-center">
        <h1 className="mx-auto mt-28 w-fit text-center text-4xl font-medium text-black text-shadow-amber-500 text-shadow-lg">
          Your Blogs
        </h1>
        <p className="z-0 mx-auto mt-10 w-1/2 rounded-sm bg-gray-500/50 p-4 text-center text-xl text-gray-100 backdrop-blur-xs">
          Don't focus on having a great blog. Focus on producing a blog that's
          great for your readers
        </p>
        <Link
          to="/create"
          className="mx-auto mt-5 block w-fit rounded-full bg-gray-800 p-2 text-sm font-medium text-gray-200"
        >
          New Blog
        </Link>
      </div>
      <div>
        <h2 className="my-5 text-center text-lg">Read all your blogs</h2>
        {blogs !== null && (
          <button
            className="mx-auto mb-8 block cursor-pointer rounded-full bg-red-600 p-1.5 text-xs text-white focus-visible:outline-hidden disabled:animate-pulse disabled:cursor-progress"
            onClick={async (e) => {
              e.target.disabled = true;
              const response = await blogAPI.delete_all();
              e.target.disabled = false;
              if (!response.resStatus) {
                toast.error(response.message);
                return;
              }
              toast.success("All blogs deleted successfully");
              setBlogs(null);
            }}
          >
            Delete All
          </button>
        )}
        <div className="mx-auto mb-4 grid w-[90%] grid-cols-4 gap-6">
          {blogs === "loading" ? (
            <h1 className="col-span-4 animate-pulse text-center text-xl font-medium text-gray-500">
              Loading...
            </h1>
          ) : blogs !== null ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blogId={blog._id}
                imageLink={blog.coverImageURL}
                title={blog.title}
                author={blog.author.username}
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-xl font-medium text-gray-500">
              No blogs published yet
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyBlogs;
