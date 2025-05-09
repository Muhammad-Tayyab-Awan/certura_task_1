import { model, Schema } from "mongoose";

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "blog",
    required: true,
  },
});

const Comment = model("comment", commentSchema);

export default Comment;
