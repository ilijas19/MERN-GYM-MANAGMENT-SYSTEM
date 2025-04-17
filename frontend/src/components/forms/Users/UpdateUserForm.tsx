import { useState } from "react";
import { User } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";
import { toast } from "react-toastify";
import { useUpdateUserByIdMutation } from "../../../redux/api/adminApiSlice";
import Loader from "../../Loader";

type FormProps = {
  updatingUser: User | null;
  onClose: () => void;
  refetch: () => void;
};

const UpdateUserForm = ({ updatingUser, onClose, refetch }: FormProps) => {
  const [fullName, setFullName] = useState<string>(updatingUser!.fullName);
  const [email, setEmail] = useState<string>(updatingUser!.email);
  const [note, setNote] = useState<string>(updatingUser!.note || "");

  const [updateApiHandler, { isLoading }] = useUpdateUserByIdMutation();

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: updatingUser!.userId,
        data: {
          fullName,
          email,
          note,
        },
      }).unwrap();
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
    <form onSubmit={updateUser} className="flex flex-col">
      <h2 className="font-semibold text-lg text-center">
        Update {updatingUser?.role}
      </h2>
      <label>Full Name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />{" "}
      <label>Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <button
        disabled={isLoading}
        className="bg-[var(--grayLight)] font-semibold py-0.5 rounded mt-1 cursor-pointer"
      >
        Update
      </button>
      {isLoading && <Loader />}
    </form>
  );
};
export default UpdateUserForm;
