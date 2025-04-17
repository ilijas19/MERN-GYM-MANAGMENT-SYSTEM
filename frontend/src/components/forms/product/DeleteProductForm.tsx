import { toast } from "react-toastify";
import { useDeleteProductMutation } from "../../../redux/api/productApiSlice";
import { Product } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";

type FormProps = {
  deletingProduct: Product | null;
  onClose: () => void;
  refetch: () => void;
};

const DeleteProductForm = ({
  deletingProduct,
  onClose,
  refetch,
}: FormProps) => {
  const [deleteApiHandler, { isLoading }] = useDeleteProductMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(
        deletingProduct!.productId.toString()
      ).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
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
        You are about to delete product{" "}
        <span className="font-semibold text-red-600">
          {deletingProduct!.name}
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
export default DeleteProductForm;
