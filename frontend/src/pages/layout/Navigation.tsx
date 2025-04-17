import {
  FaAddressCard,
  FaChartBar,
  FaDumbbell,
  FaShoppingBasket,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdDashboard } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import NavBox from "../../components/NavBox";

const navItems = [
  {
    icon: <MdDashboard />,
    title: "Dashboard",
    to: "/",
    roles: ["Admin", "Trainer", "Staff", "Member"],
  },
  {
    icon: <FaUsersGear />,
    title: "Manage Users",
    to: "/manage-users",
    roles: ["Admin"],
  },
  {
    icon: <FaDumbbell />,
    title: "Manage Packages",
    to: "/manage-packages",
    roles: ["Admin"],
  },
  {
    icon: <FaShoppingBasket />,
    title: "Manage Products",
    to: "/manage-products",
    roles: ["Admin"],
  },
  {
    icon: <FaChartBar />,
    title: "Payments",
    to: "/payments",
    roles: ["Admin"],
  },
  {
    icon: <FaAddressCard />,
    title: "Check In",
    to: "/check-in",
    roles: ["Admin", "Staff"],
  },
  {
    icon: <FaUserPlus />,
    title: "Create Member",
    to: "/create-member",
    roles: ["Staff"],
  },
  {
    icon: <FaUsersGear />,
    title: "Manage Members",
    to: "/member-list",
    roles: ["Staff"],
  },
  {
    icon: <FaShoppingBasket />,
    title: "Create Order",
    to: "/create-order",
    roles: ["Staff"],
  },
  {
    icon: <FaUsersGear />,
    title: "Manage Clients",
    to: "/manage-clients",
    roles: ["Trainer"],
  },
  {
    icon: <FiMessageSquare />,
    title: "Messages",
    to: "/messages",
    roles: ["Trainer"],
  },
  {
    icon: <FaUserPlus />,
    title: "Add Client",
    to: "/add-client",
    roles: ["Trainer"],
  },
  {
    icon: <FaAddressCard />,
    title: "Membership",
    to: "/check-membership",
    roles: ["Member"],
  },
  {
    icon: <FiMessageSquare />,
    title: "Trainer Messages",
    to: "/trainer-messages",
    roles: ["Member"],
  },
  {
    icon: <FaUser />,
    title: "Profile",
    to: "/profile",
    roles: ["Member"],
  },
];

const Navigation = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="flex  items-center py-3 px-4.5 max-w-[1300px] mx-auto w-full border-b border-gray-600">
      <AiOutlineMenuUnfold
        className="cursor-pointer rounded text-cyan-600"
        size={26}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      />
      <MdDashboard
        onClick={() => navigate("/")}
        className="cursor-pointer text-cyan-600 ml-auto mr-2"
        size={24}
      />
      <FaUser
        onClick={() => navigate("/profile")}
        className="cursor-pointer text-cyan-600"
        size={20}
      />

      <aside
        className={`fixed top-0 h-screen px-3 bg-[var(--grayDark)] border-r border-r-gray-600 flex flex-col z-50 ${
          isSidebarOpen ? "left-0 w-[17rem]" : "-left-30 w-0"
        } transition-all duration-500 px-4`}
      >
        <AiOutlineMenuFold
          size={21}
          className="absolute right-2 top-2 cursor-pointer text-cyan-600"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        />
        <h2 className="font-semibold text-center mt-4">Menu</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {navItems.map(({ icon, title, to, roles }) => (
            <NavBox
              onClick={() => setSidebarOpen(false)}
              key={to}
              icon={icon}
              title={title}
              to={to}
              roleAvailable={roles}
              userRole={currentUser?.role || ""}
            />
          ))}
        </ul>
        <Link
          to={"/profile"}
          className="mt-auto flex justify-between items-center mb-3 p-1 cursor-pointer hover:bg-[var(--grayLight)] transition-all duration-300"
        >
          <p className="font-semibold">
            {currentUser ? currentUser.fullName : "Guest"}
          </p>
        </Link>
      </aside>
    </div>
  );
};

export default Navigation;
