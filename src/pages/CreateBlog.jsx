/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLoginContext } from "../context/LoginContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import BlogSchema from "../schema/BlogSchema";
import blogAPI from "../api/blog";

function CreateBlog() {
  const navigate = useNavigate();

  const { loggedIn } = useLoginContext();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: joiResolver(BlogSchema),
    defaultValues: { title: "", content: "", imageURL: "" },
  });

  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    } else if (loggedIn === true) {
      document.title = "Create and Publish New Blog";
    }
  }, [loggedIn]);

  async function handleBlogCreate(formdata) {
    const response = await blogAPI.create_blog(formdata);
    if (!response.resStatus) {
      toast.error(response.message);
      return;
    }
    reset();
    toast.success(response.message);
  }

  return (
    <div className="w-full overflow-y-auto">
      <form
        noValidate
        className="mx-auto mt-20 h-auto w-[90%] space-y-2 rounded-md bg-gray-600 p-4 text-white *:block sm:w-1/2 md:w-1/3"
        onSubmit={handleSubmit(handleBlogCreate)}
      >
        <h1 className="text-center text-lg">Publish new blog</h1>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          {...register("title")}
          className="w-full rounded-md bg-gray-200 p-2 text-sm text-gray-900 focus-visible:outline-hidden"
        />
        <p className="text-justify text-xs text-red-500">
          {errors.title && errors.title.message}
        </p>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          {...register("content")}
          className="h-20 w-full resize-none rounded-md bg-gray-200 p-2 text-sm text-gray-900 focus-visible:outline-hidden"
        ></textarea>
        <p className="text-justify text-xs text-red-500">
          {errors.content && errors.content.message}
        </p>
        <label htmlFor="imageURL">Cover Image URL</label>
        <input
          type="url"
          name="imageURL"
          id="imageURL"
          {...register("imageURL")}
          className="w-full rounded-md bg-gray-200 p-2 text-sm text-gray-900 focus-visible:outline-hidden"
        />
        <p className="text-justify text-xs text-red-500">
          {errors.imageURL && errors.imageURL.message}
        </p>
        <button
          disabled={isSubmitting}
          className="mx-auto mt-6 block cursor-pointer bg-gray-950 px-2 py-1 text-sm focus-visible:outline-hidden disabled:animate-pulse disabled:cursor-progress"
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
