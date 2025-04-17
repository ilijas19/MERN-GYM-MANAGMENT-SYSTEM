import { useState } from "react";
import {
  useUpdateProductMutation,
  useUploadImageMutation,
} from "../../../redux/api/productApiSlice";
import { Product } from "../../../types/types";
import { toast } from "react-toastify";
import { isApiError } from "../../../utils/isApiError";
import Loader from "../../Loader";

type FormProps = {
  refetch: () => void;
  updatingProduct: Product | null;
  onClose: () => void;
};

const UpdateProductForm = ({
  refetch,
  updatingProduct,
  onClose,
}: FormProps) => {
  const [imageUrl, setImageUrl] = useState<string>(updatingProduct!.image);
  const [name, setName] = useState<string>(updatingProduct!.name);
  const [price, setPrice] = useState<number>(updatingProduct!.price);
  const [countInStock, setCountInStock] = useState<number>(
    updatingProduct!.countInStock
  );

  const [uploadImageApiHandler, { isLoading: uploadImageLoading }] =
    useUploadImageMutation();
  const [updateApiHandler, { isLoading }] = useUpdateProductMutation();

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadImageApiHandler(formData);
        setImageUrl(res.data?.url ?? "");
        toast.success(res.data?.msg);
      } catch (error) {
        if (isApiError(error)) {
          toast.success(error.data.msg);
        } else {
          toast.success("Something Went Wrong");
        }
      }
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: updatingProduct!.productId.toString(),
        data: { image: imageUrl, name, price, countInStock },
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
    <form onSubmit={submitHandler} className="flex flex-col gap-1">
      <h2 className="font-semibold text-center text-lg">Update Product</h2>
      <label>Image</label>
      <div className="flex items-center border border-gray-600 rounded px-2 py-1 mb-1">
        <label
          htmlFor="image-upload"
          className="grow cursor-pointer text-gray-400"
        >
          Click To Upload
        </label>
        <input
          disabled={uploadImageLoading}
          onChange={uploadHandler}
          hidden
          type="file"
          id="image-upload"
        />
        {uploadImageLoading && <Loader size="small" />}
        {imageUrl && imageUrl !== "" && (
          <img
            src={imageUrl}
            alt="img"
            className="h-5 w-5 bg-white object-cover"
          />
        )}
      </div>
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border border-gray-600 rounded px-2 py-0.5"
      />
      <label>Price</label>
      <input
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        type="number"
        className="border border-gray-600 rounded px-2 py-0.5"
      />
      <label>Count In Stock</label>
      <input
        value={countInStock}
        onChange={(e) => setCountInStock(+e.target.value)}
        type="number"
        className="border border-gray-600 rounded px-2 py-0.5"
      />
      <button
        disabled={isLoading}
        type="submit"
        className="bg-[var(--grayLight)] font-semibold rounded mt-2 py-0.5"
      >
        Update
      </button>
    </form>
  );
};
export default UpdateProductForm;
