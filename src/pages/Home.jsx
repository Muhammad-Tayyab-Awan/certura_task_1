import { Link } from "react-router";
import BlogCard from "../components/Blog/BlogCard";
import { useEffect, useState } from "react";
import blogAPI from "../api/blog";
import toast from "react-hot-toast";

function Home() {
  const [blogs, setBlogs] = useState("loading");
  useEffect(() => {
    blogAPI.get_all_blogs().then((response) => {
      if (!response.resStatus) {
        toast.error(response.message);
        return;
      }
      setBlogs(response.allBlogs.length > 0 ? response.allBlogs : null);
    });
  }, []);
  return (
    <>
      <div className="h-[80svh] w-full overflow-y-auto bg-[url('/blog.jpg')] bg-cover">
        <h1 className="mx-auto mt-28 w-fit text-center text-4xl font-medium text-white text-shadow-amber-500 text-shadow-lg">
          Blogs
        </h1>
        <p className="z-0 mx-auto mt-10 w-1/2 rounded-sm bg-gray-500/50 p-4 text-justify text-xl text-gray-100 backdrop-blur-xs">
          Discover others research on miscellaneous topics, and publish your own
          blogs to elaborate your ideas and opinions
        </p>
        <Link
          to="/create"
          className="mx-auto mt-5 block w-fit rounded-full bg-gray-800 p-2 text-sm font-medium text-gray-200"
        >
          Get Started
        </Link>
      </div>
      <div>
        <h2 className="my-5 text-center text-lg">Read all Blogs</h2>
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

export default Home;
