import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../../../redux/api/adminApiSlice";
import { isApiError } from "../../../utils/isApiError";
import { useState } from "react";
import Loader from "../../Loader";

type FormProps = {
  onClose: () => void;
  refetchUsers: () => void;
  role: string;
};

const CreateUserForm = ({ onClose, refetchUsers, role }: FormProps) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [createUserApiHandler, { isLoading }] = useRegisterUserMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createUserApiHandler({
        role,
        fullName,
        email,
        password,
      }).unwrap();
      toast.success(res.msg);
      refetchUsers();
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
    <form onSubmit={submitHandler} className="flex flex-col">
      <h2 className="text-lg font-semibold text-center">Create {role}</h2>
      <label htmlFor="">Full Name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label htmlFor="">Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label htmlFor="">Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label htmlFor="">Role</label>
      <input
        placeholder={role}
        disabled
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <button
        disabled={isLoading}
        className="bg-[var(--grayLight)] font-semibold rounded mt-2 py-0.5 cursor-pointer"
      >
        Create
      </button>
      {isLoading && <Loader />}
    </form>
  );
};
export default CreateUserForm;
