import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router";
import { User } from "../../types/types";
import {
  useDeleteUserByIdMutation,
  useGetAllUsersQuery,
} from "../../redux/api/adminApiSlice";
import CreateUserForm from "../../components/forms/Users/CreateUserForm";
import DeleteUserForm from "../../components/forms/Users/DeleteUserForm";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import UpdateUserForm from "../../components/forms/Users/UpdateUserForm";

const StaffList = () => {
  //STATES
  const [page, setPage] = useState<number>(1);
  const [fullName, setFullName] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [updatingUser, setUpdatingUser] = useState<User | null>(null);
  //HOOKS
  const navigate = useNavigate();

  //RTQ
  const {
    data: staff,
    isLoading,
    refetch,
  } = useGetAllUsersQuery({ page, fullName, role: "Staff" });

  const [deleteApiHandler, { isLoading: deleteLoading }] =
    useDeleteUserByIdMutation();

  //STATE HANDLERS
  const handleSearch = () => {
    setFullName(searchInput);
  };
  const openUser = (id: string) => {
    navigate(`/user/${id}`);
  };

  const handleUserDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleUserUpdate = (user: User) => {
    setUpdatingUser(user);
    setUpdateModalOpen(true);
  };

  //API
  const deleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(deletingUser!.userId).unwrap();
      toast.success(res.msg);
      refetch();
      setDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between  items-center">
        <p className="text-sm text-gray-400">Manage Users</p>
        <p className="text-sm text-gray-400">
          Total Staff : {staff?.totalUsers}
        </p>
      </div>
      <div className="flex sm:flex-row flex-col justify-between items-center">
        <h2 className="font-semibold sm:text-2xl text-xl  text-gray-100">
          Staff
        </h2>
        <div className="relative">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="text-white border border-gray-700 rounded-lg  px-3  py-1  text-sm outline-none "
            placeholder="Search For Staff"
            type="text"
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute top-0 right-0 translate-y-[48%] -translate-x-[50%] cursor-pointer"
          />
        </div>
      </div>
      {/* TABLE */}
      <div className="mt-3 flex items-center justify-between ">
        <FaUserPlus
          onClick={() => setCreateModalOpen(true)}
          size={24}
          className="text-gray-200 mb-1 cursor-pointer auto"
        />
      </div>
      <div className="overflow-x-scroll hide-scrollbar max-w-[1100px] mx-auto">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="border border-gray-600 py-2.5">UserId</th>
              <th className="border border-gray-600 py-2.5">Name</th>
              <th className="border border-gray-600 py-2.5">Email</th>
              <th className="border border-gray-600 py-2.5">Joined</th>
              <th className="border border-gray-600 py-2.5 w-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff?.users.map((user) => (
              <tr key={user.userId}>
                <td
                  onClick={() => openUser(user.userId)}
                  className={`border border-gray-700 text-cyan-600 text-center py-3 px-5 text-nowrap hover:underline cursor-pointer`}
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
                  className={`border border-gray-700  text-center py-2 px-5 text-nowrap`}
                >
                  {user.createdAt.toString().split("T")[0]}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap ">
                  <div className="flex justify-center gap-3 items-center">
                    <FaEdit
                      onClick={() => handleUserUpdate(user)}
                      size={18}
                      className="text-gray-200 cursor-pointer"
                    />
                    <FaTrash
                      onClick={() => handleUserDelete(user)}
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
          disabled={page === staff?.totalPages}
          onClick={() => setPage(page + 1)}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            !staff?.nextPage ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
      {/* CREATE MODAL */}
      <Modal
        isModalOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      >
        <CreateUserForm
          onClose={() => setCreateModalOpen(false)}
          refetchUsers={refetch}
          role={"Staff"}
        />
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdateUserForm
          updatingUser={updatingUser}
          onClose={() => setUpdateModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
      {/* DELETE MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteUserForm
          deleteHandler={deleteUser}
          deletingUser={deletingUser}
          onClose={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
        />
      </Modal>
    </section>
  );
};
export default StaffList;
