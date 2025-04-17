import { toast } from "react-toastify";
import { useDeleteChatMutation } from "../../../redux/api/chatApiSlice";
import { Chat } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";

type FormProps = {
  openedChat: Chat | null;
  onClose: () => void;
  setOpenedChat: (chat: Chat | null) => void;
  refetch: () => void;
};

const DeleteChatForm = ({
  openedChat,
  onClose,
  setOpenedChat,
  refetch,
}: FormProps) => {
  const [deleteApiHandler, { isLoading }] = useDeleteChatMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteApiHandler(openedChat!._id).unwrap();
      toast.success(res.msg);
      setOpenedChat(null);
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
    <div>
      <h2 className="text-center font-semibold text-xl text-red-700">
        Are You Sure ?
      </h2>
      <p className="text-center my-2 text-gray-300 text-lg">
        Delete conversation with{" "}
        <span className="text-cyan-600"> {openedChat?.memberId.fullName}</span>
      </p>
      <div className="flex justify-center gap-3 mt-4">
        <button
          className="bg-white text-black font-semibold px-3 rounded cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          disabled={isLoading}
          className="bg-red-600 text-white font-semibold px-4 py-0.5 rounded cursor-pointer hover:bg-red-500 transition-colors"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default DeleteChatForm;
