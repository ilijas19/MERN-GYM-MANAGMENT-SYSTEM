import { FaUsersGear } from "react-icons/fa6";
import DashBox from "../../components/DashBox";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GrUserWorker } from "react-icons/gr";
import { FaDumbbell } from "react-icons/fa";
const dashboardItems = [
  {
    icon: <FaUsersGear />,
    title: "Members",
    to: "/member-list",
    roles: ["Admin"],
  },
  {
    icon: <GrUserWorker />,
    title: "Staff",
    to: "/staff-list",
    roles: ["Admin"],
  },
  {
    icon: <FaDumbbell />,
    title: "Trainers",
    to: "/trainer-list",
    roles: ["Admin"],
  },
];

const ManageUsers = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <section className="">
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <ul className="flex flex-wrap justify-center gap-4 mt-8 max-w-[1000px] mx-auto">
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
export default ManageUsers;
