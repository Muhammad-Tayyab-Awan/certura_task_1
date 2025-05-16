import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="relative min-h-[100svh] w-full bg-gray-200 text-gray-950">
      <Navbar />
      <div className="min-h-[calc(100svh-5.25rem)] overflow-y-auto">{children}</div>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            backgroundColor: "grey",
            maxWidth: "fit-content",
            color: "whitesmoke",
          },
        }}
      />
    </div>
  );
}

export default MainLayout;
