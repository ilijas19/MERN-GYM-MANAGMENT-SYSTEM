import { useNavigate } from "react-router";
import {
  useGetAllPackagePaymentsQuery,
  useGetTotalPackagesRevenueQuery,
  useGetMonthlyPackageRevenueQuery,
} from "../../redux/api/PaymentApiSlice";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

const PackagePayments = () => {
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const {
    data: payments,
    isLoading,
    refetch,
  } = useGetAllPackagePaymentsQuery({ page });

  const { data: totalRevenue, isLoading: totalRevenueLoading } =
    useGetTotalPackagesRevenueQuery();

  const { data: monthRevenue, isLoading: monthRevenueLoading } =
    useGetMonthlyPackageRevenueQuery();

  const openUser = (userId: string) => {
    navigate(`/member/${userId}`);
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading || totalRevenueLoading || monthRevenueLoading) {
    return <Loader />;
  }

  return (
    <section>
      <h2 className="font-semibold text-xl">Manage Payments</h2>
      <p className="text-gray-400 text-sm">Packages</p>
      <ul className="flex flex-wrap gap-6 mt-6 justify-center">
        <li className="h-[15rem] w-[15rem] bg-[var(--grayLight)] rounded flex items-center justify-center flex-col gap-2 border border-cyan-900 ">
          <p className="text-2xl text-cyan-600 font-semibold">
            {totalRevenue?.totalRevenue} $
          </p>
          <p className="font-semibold text-lg">Total Revenue</p>
        </li>
        <li className="h-[15rem] w-[15rem] bg-[var(--grayLight)] rounded flex items-center justify-center flex-col gap-2 border border-cyan-900 ">
          <p className="text-2xl text-cyan-600 font-semibold">
            {monthRevenue?.totalRevenue} $
          </p>
          <p className="font-semibold text-lg">This Month</p>
        </li>
        <li className="h-[15rem] w-[15rem] bg-[var(--grayLight)] rounded flex items-center justify-center flex-col gap-2 border border-cyan-900 cursor-pointer">
          <p className="text-2xl text-cyan-600 font-semibold">
            {monthRevenue?.totalPayments}
          </p>
          <p className="font-semibold text-lg">Sold This Month</p>
        </li>
      </ul>
      <h3 className="mt-2 text-lg font-semibold max-w-[1100px] mx-auto my-2">
        Payment List
      </h3>
      <div className="overflow-x-scroll hide-scrollbar max-w-[1100px] mx-auto">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="border border-gray-600 py-2.5">Date</th>
              <th className="border border-gray-600 py-2.5">Member</th>
              <th className="border border-gray-600 py-2.5">Package</th>
              <th className="border border-gray-600 py-2.5">Price</th>
            </tr>
          </thead>
          <tbody>
            {payments?.payments.map((payment) => (
              <tr key={payment._id}>
                <td
                  className={`border border-gray-700  text-center py-3 px-5 text-nowrap `}
                >
                  {payment.createdAt.toString().split("T")[0]}
                </td>
                <td
                  onClick={() => openUser(payment.member.userId)}
                  className="border border-gray-700  text-center py-2 px-5 text-nowrap text-cyan-600  hover:underline cursor-pointer"
                >
                  {payment.member.fullName}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap">
                  {payment.package.name}
                </td>
                <td
                  className={`border border-gray-700  text-center py-2 px-5 text-nowrap`}
                >
                  {payment.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 my-4 mb-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            page <= 1 ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>
        <button
          disabled={page === payments?.totalPages}
          onClick={() => setPage(page + 1)}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            !payments?.nextPage ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
};
export default PackagePayments;
