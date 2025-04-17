import { useState } from "react";
import Loader from "../../components/Loader";
import { useGetAllClientsQuery } from "../../redux/api/trainerApiSlice";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { isMembershipValid } from "../../utils/isMembershipValid";
import { User } from "../../types/types";
import Modal from "../../components/Modal";
import RemoveClientForm from "../../components/forms/Trainer/RemoveClientForm";

const ManageClients = () => {
  const [page, setPage] = useState<number>(1);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState<boolean>(false);
  const [removingClient, setRemovingClient] = useState<User | null>(null);

  const { data: clients, isLoading, refetch } = useGetAllClientsQuery();
  const navigate = useNavigate();

  const openUser = (id: string) => {
    navigate(`/client/${id}`);
  };

  const handleClientRemove = (user: User) => {
    setRemovingClient(user);
    setRemoveModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section>
      <h2 className="text-xl">Manage Clients</h2>
      <p className="text-gray-500">Total Clients : {clients?.totalClients}</p>
      {/* TABLE */}
      <div className="mt-3 flex items-center justify-between  max-w-[1100px] mx-auto">
        {/* <select
          className={`outline-none cursor-pointer ${
            active === undefined
              ? "text-white"
              : active
              ? "text-cyan-600 font-semibold"
              : "text-red-600"
          }`}
          onChange={handleSelectChange}
        >
          <option value="all" className="bg-gray-800 text-white">
            All
          </option>
          <option
            value="true"
            className="bg-gray-800 text-cyan-600 font-semibold"
          >
            Active
          </option>
          <option value="false" className="bg-gray-800 text-red-600">
            Not Active
          </option>
        </select> */}
      </div>
      <div className="overflow-x-scroll hide-scrollbar max-w-[1100px] mx-auto">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="border border-gray-600 py-2.5">UserId</th>
              <th className="border border-gray-600 py-2.5">Name</th>
              <th className="border border-gray-600 py-2.5">Email</th>
              <th className="border border-gray-600 py-2.5">Active</th>
              <th className="border border-gray-600 py-2.5 w-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients?.clients.map((user) => (
              <tr key={user.userId}>
                <td
                  onClick={() => openUser(user.userId)}
                  className={`border border-gray-700 ${
                    isMembershipValid(user.membershipExpDate.toString())
                      ? "text-cyan-600 font-semibold"
                      : "text-red-600"
                  } text-center py-3 px-5 text-nowrap hover:underline cursor-pointer`}
                >
                  {user.userId}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap">
                  {user.fullName}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap">
                  {user.email}
                </td>
                <td
                  className={`border border-gray-700  text-center py-2 px-5 text-nowrap ${
                    isMembershipValid(user.membershipExpDate.toString())
                      ? "text-cyan-600 font-semibold"
                      : "text-red-600"
                  }`}
                >
                  {isMembershipValid(user.membershipExpDate.toString())
                    ? "Active"
                    : "Not Active"}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap ">
                  <div className="flex justify-center gap-3 items-center">
                    <FaTrash
                      onClick={() => handleClientRemove(user)}
                      size={17}
                      className="text-red-600 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-4">
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
          disabled={page === clients?.totalPages}
          onClick={() => setPage(page + 1)}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            !clients?.nextPage ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
      <Modal
        isModalOpen={isRemoveModalOpen}
        onClose={() => setRemoveModalOpen(false)}
      >
        <RemoveClientForm
          removingClient={removingClient}
          onClose={() => setRemoveModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
    </section>
  );
};
export default ManageClients;
