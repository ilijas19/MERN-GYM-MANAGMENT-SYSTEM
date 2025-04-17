import DashBox from "../../components/DashBox";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FiPackage } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
const Payments = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <section>
      <h2 className="font-semibold text-xl">Manage Payments</h2>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        <DashBox
          title="Package Payments"
          to="/packagePayments"
          icon={<FiPackage />}
          userRole={currentUser?.role || ""}
          roleAvailable={["Admin"]}
        />
        <DashBox
          title="Product Payments"
          to="/productPayments"
          icon={<IoBagOutline />}
          userRole={currentUser?.role || ""}
          roleAvailable={["Admin"]}
        />
      </div>
    </section>
  );
};
export default Payments;
