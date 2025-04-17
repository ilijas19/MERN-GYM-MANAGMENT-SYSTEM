import { toast } from "react-toastify";
import { useDeletePackageMutation } from "../../../redux/api/packageApiSlice";
import { Package } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";

type FormProps = {
  onClose: () => void;
  refetch: () => void;
  deletingPackage: Package | null;
};

const DeletePackageForm = ({
  onClose,
  refetch,
  deletingPackage,
}: FormProps) => {
  const [deleteApiHandler, { isLoading }] = useDeletePackageMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(deletingPackage!._id).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto  p-8  text-center space-y-6"
    >
      <h2 className="text-2xl font-bold ">Are you sure?</h2>
      <p className="text-gray-300">
        You are about to delete package{" "}
        <span className="font-semibold text-red-600">
          {deletingPackage!.name}
        </span>
        .
      </p>

      <div className="flex justify-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer sm:px-5 sm:py-2 px-3 py-1 rounded-md text-white font-semibold transition ${
            isLoading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="sm:px-5 sm:py-2 px-3 py-1 rounded-md bg-gray-300 text-black font-semibold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default DeletePackageForm;
