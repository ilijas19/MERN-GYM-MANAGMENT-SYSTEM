import { toast } from "react-toastify";
import { isApiError } from "../../../utils/isApiError";
import { useUpdatePofilePasswordMutation } from "../../../redux/api/userApiSlice";
import { useState } from "react";

type FormProps = {
  onClose: () => void;
};
const UpdatePasswordForm = ({ onClose }: FormProps) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [apiHandler, { isLoading }] = useUpdatePofilePasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await apiHandler({
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      }).unwrap();
      toast.success(res.msg);
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
    <form onSubmit={handleSubmit} className="py-2 flex flex-col">
      <h2 className="font-semibold text-center  text-lg">Update Password</h2>
      <label>Current Password</label>
      <input
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        type="password"
        className="border border-gray-500 rounded-lg px-2 py-1 mt-1 mb-2"
      />
      <label>New Password</label>
      <input
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        className="border border-gray-500 rounded-lg px-2 py-1 mt-1 mb-2"
      />
      <label>Confirm Password</label>
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        className="border border-gray-500 rounded-lg px-2 py-1 mt-1 mb-2"
      />
      <button
        disabled={isLoading}
        className="bg-white text-black font-semibold mt-2 rounded-lg py-0.5 border hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
      >
        Update
      </button>
    </form>
  );
};
export default UpdatePasswordForm;
