import { useState } from "react";
import { useCreatePackageMutation } from "../../../redux/api/packageApiSlice";
import { isApiError } from "../../../utils/isApiError";
import { toast } from "react-toastify";
import Loader from "../../Loader";

type FormProps = {
  onClose: () => void;
  refetch: () => void;
};

const CreatePackageForm = ({ onClose, refetch }: FormProps) => {
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);

  const [createApiHandler, { isLoading }] = useCreatePackageMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createApiHandler({ name, duration, price }).unwrap();
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
    <form onSubmit={onSubmit} className="flex flex-col">
      <h2 className="font-semibold text-lg text-center">Create Package</h2>
      <label htmlFor="">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label htmlFor="">Duration (days)</label>
      <input
        value={duration}
        onChange={(e) => setDuration(+e.target.value)}
        type="number"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />
      <label htmlFor="">Price</label>
      <input
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        type="text"
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
export default CreatePackageForm;
