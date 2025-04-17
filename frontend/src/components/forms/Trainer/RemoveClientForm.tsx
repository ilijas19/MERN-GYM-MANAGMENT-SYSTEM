import { toast } from "react-toastify";
import { useRemoveClientMutation } from "../../../redux/api/trainerApiSlice";
import { User } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";

type FormProps = {
  removingClient: User | null;
  onClose: () => void;
  refetch: () => void;
};

const RemoveClientForm = ({ removingClient, onClose, refetch }: FormProps) => {
  const [removeApiHandler, { isLoading }] = useRemoveClientMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await removeApiHandler(removingClient!.userId).unwrap();
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h2 className="text-center text-xl text-red-700 font-semibold">
        Remove Client
      </h2>
      <p className="text-lg text-center my-2">
        Are you sure you want to remove client{" "}
        <span className="text-cyan-600">{removingClient?.fullName}</span> ?
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer  px-3 py-1 rounded-md text-white font-semibold transition ${
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
          className="  px-3 py-1 rounded-md bg-gray-300 text-black font-semibold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default RemoveClientForm;
