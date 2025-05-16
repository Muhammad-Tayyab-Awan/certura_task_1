import { Link } from "react-router";

function BlogCard({ title, author, imageLink }) {
  return (
    <Link
      to={title.trim().toLowerCase().replace(/ /g, "-")}
      className={`relative flex h-56 flex-col justify-end rounded-xl bg-[url('${imageLink}')] bg-amber-500 bg-cover p-4 ring hover:*:first:flex`}
    >
      <p className="absolute top-0 right-0 hidden rounded-tr-xl rounded-bl-xl bg-gray-200 p-1 text-xs">
        {author}
      </p>
      <h3 className="rounded-md bg-white/50 py-1.5 text-center font-medium backdrop-blur-xs">
        {title.length > 30 ? title.slice(0, 30) + "..." : title}
      </h3>
    </Link>
  );
}

export default BlogCard;
