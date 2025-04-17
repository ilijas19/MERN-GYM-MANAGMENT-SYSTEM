import { User } from "../../../types/types";

type FormProps = {
  deleteHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deletingUser: User | null;
  onClose: () => void;
  isLoading: boolean;
};

const DeleteUserForm = ({
  deleteHandler,
  deletingUser,
  onClose,
  isLoading,
}: FormProps) => {
  if (!deletingUser) return null;

  return (
    <form
      onSubmit={deleteHandler}
      className="max-w-md mx-auto  p-8  text-center space-y-6"
    >
      <h2 className="text-2xl font-bold ">Are you sure?</h2>
      <p className="text-gray-300">
        You are about to delete {deletingUser.role}{" "}
        <span className="font-semibold text-red-600">
          {deletingUser.fullName}
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

export default DeleteUserForm;
