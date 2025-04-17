import { FaClock, FaDollarSign, FaEdit, FaStar, FaTrash } from "react-icons/fa";
import { useGetAllPackagesQuery } from "../../redux/api/packageApiSlice";
import Loader from "../../components/Loader";
import { useState } from "react";
import Modal from "../../components/Modal";
import CreatePackageForm from "../../components/forms/Packages/CreatePackageForm";
import { Package } from "../../types/types";
import DeletePackageForm from "../../components/forms/Packages/DeletePackageForm";
import UpdatePackageForm from "../../components/forms/Packages/UpdatePackageForm";

const ManagePackages = () => {
  const { data: packages, isLoading, refetch } = useGetAllPackagesQuery();

  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [updatingPackage, setUpdatingPackage] = useState<Package | null>(null);

  const handleEdit = (gymPackage: Package) => {
    setUpdatingPackage(gymPackage);
    setUpdateModalOpen(true);
  };

  const handleDelete = (gymPackage: Package) => {
    setDeletingPackage(gymPackage);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <div className="flex justify-between">
        <h2 className="sm:text-xl text-lg font-semibold">Manage Packages</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-cyan-700 font-semibold sm:px-2 rounded-lg sm:text-base text-xs px-1 cursor-pointer"
        >
          Add Package
        </button>
      </div>
      <p className="text-gray-500 sm:text-base text-xs">Total Packages : {}</p>
      <ul className="flex flex-wrap mt-4 sm:gap-10 gap-5 justify-center">
        {packages?.packages.map((gymPackage) => (
          <li
            className="bg-[var(--grayLight)] w-[15rem] rounded py-2"
            key={gymPackage._id}
          >
            <h2 className="flex items-center justify-center gap-2 font-semibold mb-4">
              <FaStar className="text-cyan-600" />
              {gymPackage.name}
            </h2>
            <div className="flex justify-between mx-2 mb-1">
              <p className="flex items-center gap-1 text-gray-100">
                <FaClock className="text-cyan-600" />
                {gymPackage.duration}{" "}
                {gymPackage.duration === 1 ? "Day" : "Days"}
              </p>
              <p className="flex items-center  text-gray-100">
                <FaDollarSign className="text-cyan-600" />
                {gymPackage.price} USD
              </p>
            </div>
            <div className="flex items-center p-2 gap-2">
              <p
                className={`text-start ${
                  gymPackage.isActive ? "text-cyan-600" : "text-red-700"
                } text-xs mr-auto`}
              >
                {gymPackage.isActive ? "Active" : "Not Active"}
              </p>
              <FaEdit
                onClick={() => handleEdit(gymPackage)}
                size={18}
                className="text-cyan-600 cursor-pointer"
              />
              <FaTrash
                onClick={() => handleDelete(gymPackage)}
                className="text-red-700 cursor-pointer"
              />
            </div>
          </li>
        ))}
      </ul>
      {/* CREATE MODAL */}
      <Modal
        isModalOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      >
        <CreatePackageForm
          onClose={() => setCreateModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
      {/* DELETE MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeletePackageForm
          deletingPackage={deletingPackage}
          refetch={refetch}
          onClose={() => setDeleteModalOpen(false)}
        />
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdatePackageForm
          updatingPackage={updatingPackage}
          refetch={refetch}
          onClose={() => setUpdateModalOpen(false)}
        />
      </Modal>
    </section>
  );
};
export default ManagePackages;
