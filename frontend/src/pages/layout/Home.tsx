import { FaUsersGear } from "react-icons/fa6";
import {
  FaChartBar,
  FaDumbbell,
  FaShoppingBasket,
  FaUser,
} from "react-icons/fa";
import DashBox from "../../components/DashBox";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaUserPlus } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

const dashboardItems = [
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
    roles: ["Memberr"],
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

const Home = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  console.log(currentUser);

  return (
    <section className="">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mb-4 text-gray-500">{currentUser?.role}</p>

      <ul className="flex flex-wrap justify-center xl:gap-7 gap-5  max-w-[1000px] mx-auto">
        {dashboardItems.map(({ icon, title, to, roles }) => (
          <DashBox
            key={to}
            icon={icon}
            title={title}
            to={to}
            roleAvailable={roles}
            userRole={currentUser?.role || ""}
          />
        ))}
      </ul>
    </section>
  );
};

export default Home;
