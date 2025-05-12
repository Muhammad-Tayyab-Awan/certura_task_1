import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    coverImageURL: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

export default Blog;
