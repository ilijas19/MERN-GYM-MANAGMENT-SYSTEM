import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import Navigation from "./pages/layout/Navigation";

const App = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes("messages");

  return (
    <div className="min-h-screen border max-w-[1300px] mx-auto border-[var(--grayLight)] flex flex-col">
      <ToastContainer />
      <Navigation />
      <main
        className={`mx-auto sm:px-6 py-4 px-3 grow h-full w-full ${
          isChatPage ? "flex flex-col" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default App;
