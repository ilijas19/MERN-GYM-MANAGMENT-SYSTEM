import { useState } from "react";
import { useGetAllPackagesQuery } from "../../redux/api/packageApiSlice";
import { Package } from "../../types/types";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useRegisterMemberMutation } from "../../redux/api/staffApiSlice";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router";

const CreateMember = () => {
  const { data: packages, isLoading } = useGetAllPackagesQuery();

  const [selectedPackage, setSelectedPackage] = useState<Package | string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [createMemberApiHandler, { isLoading: registerLoading }] =
    useRegisterMemberMutation();

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedPackage === "") {
        toast.error("Select Package");
      }
      const res = await createMemberApiHandler({
        fullName,
        email,
        gymPackage:
          typeof selectedPackage === "object" && "_id" in selectedPackage
            ? selectedPackage._id
            : "",
      }).unwrap();
      toast.success(res.msg);
      navigate("/member-list");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <h2 className="text-xl text-center">Create Member</h2>
      <form
        onSubmit={onSubmit}
        className="max-w-[400px] mx-auto flex flex-col gap-0.5 mt-2"
      >
        <label>Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          className="border border-gray-600 rounded px-2 py-0.5 mb-1"
        />
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="border border-gray-600 rounded px-2 py-0.5 mb-1"
        />
        <label>Package</label>
        <select
          onChange={(e) =>
            setSelectedPackage(
              packages?.packages.find((pkg) => pkg._id === e.target.value) || ""
            )
          }
          className="border border-gray-600 rounded px-1 py-1 mb-1"
        >
          <option className="bg-[var(--grayLight)]" value={""}>
            Choose Package
          </option>
          {packages?.packages.map((gymPackage) => (
            <option
              className="bg-[var(--grayLight)]"
              value={gymPackage._id}
              key={gymPackage._id}
            >
              {gymPackage.name}
            </option>
          ))}
        </select>
        <p>
          Price To Pay :{" "}
          {typeof selectedPackage === "object" && "price" in selectedPackage
            ? selectedPackage.price
            : ""}{" "}
          $
        </p>
        <button
          disabled={registerLoading}
          className="bg-white text-black font-semibold rounded-lg py-0.5 mt-2 cursor-pointer hover:bg-gray-200"
        >
          Create
        </button>
      </form>
    </section>
  );
};
export default CreateMember;
