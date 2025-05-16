import { Link } from "react-router";
import { useLoginContext } from "../../context/LoginContext";
import authAPI from "../../api/auth";
import toast from "react-hot-toast";

function AccountModal({ accountModal, setAccountModal }) {
  const { loggedIn, username, setLoginState } = useLoginContext();
  async function handleLogout() {
    const response = await authAPI.logout();
    if (!response.resStatus) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    setLoginState({ loggedIn: false, userId: null, username: null });
  }
  return (
    <div
      className={`absolute top-[175%] right-0 z-10 h-fit w-fit rounded-md bg-gray-300 p-1 text-gray-950 ${accountModal ? "account-modal" : "hidden"} cursor-default border border-gray-800`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {loggedIn && (
        <h1 className="mb-1 text-center text-sm font-medium">Account</h1>
      )}
      {loggedIn ? (
        <div className="space-y-1 px-1">
          <p className="text-sm">{username}</p>
          <div
            className="cursor-pointer rounded-md bg-red-500 px-2 py-1 text-sm text-gray-200"
            onClick={() => {
              setAccountModal(false);
              handleLogout();
            }}
          >
            Logout
          </div>
        </div>
      ) : (
        <div className="space-y-1 p-1 *:block">
          <Link
            to="/login"
            className="rounded-md bg-gray-900 px-2 py-1 text-sm text-gray-200"
            onClick={() => {
              setAccountModal(false);
            }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-gray-600 px-2 py-1 text-sm text-gray-200"
            onClick={() => {
              setAccountModal(false);
            }}
          >
            Join
          </Link>
        </div>
      )}
    </div>
  );
}

export default AccountModal;
