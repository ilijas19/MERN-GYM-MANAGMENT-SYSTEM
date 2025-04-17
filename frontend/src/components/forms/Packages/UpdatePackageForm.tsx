import { useState } from "react";
import { Package } from "../../../types/types";
import { useUpdatePackageMutation } from "../../../redux/api/packageApiSlice";
import Loader from "../../Loader";
import { isApiError } from "../../../utils/isApiError";
import { toast } from "react-toastify";
import { useGetSinglePackageRevenueQuery } from "../../../redux/api/PaymentApiSlice";

type FormProps = {
  updatingPackage: Package | null;
  refetch: () => void;
  onClose: () => void;
};

const UpdatePackageForm = ({
  updatingPackage,
  refetch,
  onClose,
}: FormProps) => {
  const [name, setName] = useState<string>(updatingPackage!.name);
  const [duration, setDuration] = useState<number>(updatingPackage!.duration);
  const [price, setPrice] = useState<number>(updatingPackage!.price);

  const [updateApiHandler, { isLoading }] = useUpdatePackageMutation();

  const { data: packageRevenue, isLoading: packageRevenueLoading } =
    useGetSinglePackageRevenueQuery(updatingPackage!._id);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: updatingPackage!._id,
        data: { name, duration, price },
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
    <form onSubmit={onSubmit} className="flex flex-col">
      <h2 className="font-semibold text-lg text-center">Package Info</h2>
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
      />{" "}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <label htmlFor="">Total Revenue</label>
          <input
            placeholder={
              packageRevenueLoading
                ? "Loading"
                : packageRevenue?.totalRevenue.toString() + "$"
            }
            type="text"
            className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="self-end">Total Times Sold</label>
          <input
            disabled
            placeholder={
              packageRevenueLoading
                ? "Loading"
                : packageRevenue?.totalPayments.toString()
            }
            type="text"
            className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
          />
        </div>
      </div>
      <button
        disabled={isLoading}
        className="bg-[var(--grayLight)] font-semibold rounded mt-2 py-0.5 cursor-pointer"
      >
        Update
      </button>
      {isLoading && <Loader />}
    </form>
  );
};
export default UpdatePackageForm;
