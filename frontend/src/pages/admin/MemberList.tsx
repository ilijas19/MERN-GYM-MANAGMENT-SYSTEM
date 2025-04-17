import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import {
  useDeleteMemberMutation,
  useGetAllMembersQuery,
} from "../../redux/api/staffApiSlice";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Modal from "../../components/Modal";
import CreateMemberForm from "../../components/forms/Member/CreateMemberForm";
import { useGetAllPackagesQuery } from "../../redux/api/packageApiSlice";
import { useNavigate } from "react-router";
import UpdateMemberForm from "../../components/forms/Member/UpdateMemberForm";
import { User } from "../../types/types";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import DeleteUserForm from "../../components/forms/Users/DeleteUserForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const MemberList = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  //STATES
  const [page, setPage] = useState<number>(1);
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [fullName, setFullName] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [updatingMember, setUpdatingMember] = useState<User | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingMember, setDeletingMember] = useState<User | null>(null);

  //HOOKS
  const navigate = useNavigate();

  //API
  const {
    data: members,
    isLoading,
    refetch,
  } = useGetAllMembersQuery({ page, active, fullName });

  const { data: packages, isLoading: packageLoading } =
    useGetAllPackagesQuery();

  const [deleteApiHandler, { isLoading: deleteLoading }] =
    useDeleteMemberMutation();

  // const [updateApiHandler, { isLoading: updateLoading }] =
  //   useUpdateMemberMutation();

  //STATE HANDLERS
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "all" | "true" | "false";
    if (value === "all") setActive(undefined);
    else if (value === "true") setActive(true);
    else if (value === "false") setActive(false);
  };
  const handleSearch = () => {
    setFullName(searchInput);
  };
  const openUser = (id: string) => {
    navigate(`/member/${id}`);
  };

  const handleMemberUpdate = (member: User) => {
    setUpdatingMember(member);
    setUpdateModalOpen(true);
  };

  const handleMemberDelete = (member: User) => {
    setDeletingMember(member);
    setDeleteModalOpen(true);
  };

  //API

  const deleteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(deletingMember!.userId).unwrap();
      toast.success(res.msg);
      refetch();
      setDeleteModalOpen(false);
      setDeletingMember(null);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading || packageLoading) {
    return <Loader />;
  }

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between  items-center">
        <p className="text-sm text-gray-400">Manage Users</p>
        <p className="text-sm text-gray-400">
          Total Members : {members?.totalUsers}
        </p>
      </div>
      <div className="flex sm:flex-row flex-col justify-between items-center">
        <h2 className="font-semibold sm:text-2xl text-xl  text-gray-100">
          Members
        </h2>
        <div className="relative">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="text-white border border-gray-700 rounded-lg  px-3  py-1  text-sm outline-none "
            placeholder="Search For Member"
            type="text"
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute top-0 right-0 translate-y-[48%] -translate-x-[50%] cursor-pointer"
          />
        </div>
      </div>
      {/* TABLE */}
      <div className="mt-3 flex items-center justify-between  max-w-[1100px] mx-auto">
        <FaUserPlus
          onClick={() => setCreateModalOpen(true)}
          size={24}
          className={`text-gray-200 mb-1 cursor-pointer auto ${
            currentUser?.role !== "Admin" && "hidden"
          }`}
        />
        <select
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
        </select>
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
            {members?.users.map((user) => (
              <tr key={user.userId}>
                <td
                  onClick={() => openUser(user.userId)}
                  className={`border border-gray-700 ${
                    user.active ? "text-cyan-600 font-semibold" : "text-red-600"
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
                    user.active ? "text-cyan-600 font-semibold" : "text-red-600"
                  }`}
                >
                  {user.active ? "Active" : "Not Active"}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap ">
                  <div className="flex justify-center gap-3 items-center">
                    <FaEdit
                      onClick={() => handleMemberUpdate(user)}
                      size={18}
                      className="text-gray-200 cursor-pointer"
                    />
                    <FaTrash
                      onClick={() => handleMemberDelete(user)}
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
          disabled={page === members?.totalPages}
          onClick={() => setPage(page + 1)}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            !members?.nextPage ? "opacity-30 cursor-not-allowed" : ""
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
        <CreateMemberForm
          packages={packages!.packages}
          onClose={() => setCreateModalOpen(false)}
          refetchUsers={refetch}
        />
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        {
          <UpdateMemberForm
            onClose={() => setUpdateModalOpen(false)}
            updatingUser={updatingMember}
            refetch={refetch}
          />
        }
      </Modal>
      {/* DELETE MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteUserForm
          deleteHandler={deleteMember}
          deletingUser={deletingMember}
          onClose={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
        />
      </Modal>
    </section>
  );
};
export default MemberList;
