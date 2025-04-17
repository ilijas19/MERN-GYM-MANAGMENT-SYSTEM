import { toast } from "react-toastify";
import { useRegisterMemberMutation } from "../../../redux/api/staffApiSlice";
import { Package } from "../../../types/types";
import { isApiError } from "../../../utils/isApiError";
import { useState } from "react";
import Loader from "../../Loader";

type FormProps = {
  packages: Package[];
  onClose: () => void;
  refetchUsers: () => void;
};

const CreateMemberForm = ({ packages, onClose, refetchUsers }: FormProps) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gymPackage, setGymPackage] = useState<string>("");

  const [createMemberApiHandler, { isLoading }] = useRegisterMemberMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createMemberApiHandler({
        fullName,
        email,
        gymPackage,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-0.5">
      <h2 className="text-center font-semibold text-lg">Create Member</h2>
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
      <label htmlFor="">Package</label>
      <select
        onChange={(e) => setGymPackage(e.target.value)}
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      >
        <option className="bg-gray-800" value="">
          Select Package
        </option>
        {packages.map((gymPackage) => (
          <option
            className="bg-gray-800"
            key={gymPackage._id}
            value={gymPackage._id}
          >
            {gymPackage.name}
          </option>
        ))}
      </select>
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
export default CreateMemberForm;
