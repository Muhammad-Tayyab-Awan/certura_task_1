import { Link } from "react-router";
import AccountModal from "../Account/AccountModal";
import { useState } from "react";
import { useLoginContext } from "../../context/LoginContext";

function Navbar() {
  const [accountModal, setAccountModal] = useState(false);
  const { loggedIn } = useLoginContext();
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-gray-800 px-1 text-gray-200 sm:px-2">
      <h1 className="text-sm transition-all duration-700 ease-in-out text-shadow-2xs text-shadow-amber-600 hover:text-shadow-md sm:text-lg">
        Write Your Blogs
      </h1>
      <nav className="space-x-1 text-xs *:rounded-sm *:bg-gray-600 *:px-1 *:py-1 *:transition-all *:duration-700 *:ease-in-out *:hover:bg-gray-500 sm:space-x-1.5 sm:text-sm *:sm:px-1.5">
        <Link to="/">Blogs</Link>
        {loggedIn ? (
          <>
            <Link to="/my-blogs">My Blogs</Link>
            <Link to="/create">New Blog</Link>
          </>
        ) : (
          <></>
        )}
        <button
          className="relative cursor-pointer focus-visible:outline-hidden"
          onClick={() => {
            setAccountModal(!accountModal);
          }}
        >
          Account
          <AccountModal
            accountModal={accountModal}
            setAccountModal={setAccountModal}
          />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
