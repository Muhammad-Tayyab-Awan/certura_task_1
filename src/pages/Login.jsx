/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import authAPI from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useLoginContext } from "../context/LoginContext";
import { joiResolver } from "@hookform/resolvers/joi";
import AuthenticationSchema from "../schema/AuthenticationSchema";
import Joi from "joi";

function Login() {
  const navigate = useNavigate();

  const { loggedIn, setLoginState } = useLoginContext();

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: joiResolver(AuthenticationSchema),
    defaultValues: { username: "", password: "" },
  });

  async function handleLogin(formdata) {
    const response = await authAPI.login(formdata);
    reset();
    if (!response.resStatus) {
      toast.error(response.message);
      return;
    }
    setLoginState({ loggedIn: true });
    toast.success(response.message);
  }

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <form
      noValidate
      className="mx-auto mt-5 h-auto w-1/3 space-y-2 rounded-sm bg-gray-600 px-4 py-6 text-gray-100 *:block"
      onSubmit={handleSubmit(handleLogin)}
    >
      <h1 className="text-center text-lg font-medium">Login Now</h1>
      <label htmlFor="username" className="cursor-pointer">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="username"
        {...register("username")}
        className="w-full rounded-sm bg-gray-100 p-1 text-center text-gray-600 focus-visible:outline-hidden"
      />
      <p className="text-end text-xs text-red-400">
        {errors.username && errors.username.message}
      </p>
      <label htmlFor="password" className="cursor-pointer">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        {...register("password")}
        className="w-full rounded-sm bg-gray-100 p-1 text-center text-gray-600 focus-visible:outline-hidden"
      />
      <p className="text-end text-xs text-red-400">
        {errors.password && errors.password.message}
      </p>
      <button
        disabled={isSubmitting}
        className={`mx-auto mt-4 mb-1 cursor-pointer rounded-sm bg-gray-950 px-1.5 py-1 text-sm focus-visible:outline-hidden ${isSubmitting && "animate-pulse"} disabled:cursor-progress`}
      >
        Login
      </button>
    </form>
  );
}

export default Login;
