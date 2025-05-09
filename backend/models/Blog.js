import { model, Schema } from "mongoose";

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  blogDescription: {
    type: String,
    required: true,
  },
  blogBanner: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  isPublic: {
    type: String,
    required: true,
    default: true,
  },
  updatedOn: {
    type: String,
    required: true,
  },
  publishedOn: {
    type: String,
    required: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  tags: {
    type: [String],
  },
  category: {
    type: String,
    required: true,
    default: "general",
  },
});

const Blog = model("blog", blogSchema);

export default Blog;
