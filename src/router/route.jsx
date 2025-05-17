import { Route, Routes } from "react-router";

// Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import MyBlogs from "../pages/MyBlogs";
import Blog from "../pages/Blog";
import CreateBlog from "../pages/CreateBlog";
import NotFound from "../pages/NotFound";
import UpdateBlog from "../pages/UpdateBlog";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/create" element={<CreateBlog />} />
      <Route path="/blog/:blogId" element={<Blog />} />
      <Route path="/update/:blogId" element={<UpdateBlog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
