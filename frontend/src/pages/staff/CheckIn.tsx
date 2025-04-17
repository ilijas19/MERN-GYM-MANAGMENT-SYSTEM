import { useState } from "react";
import {
  useCheckMembershipMutation,
  useRenewMembershipMutation,
} from "../../redux/api/staffApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { User } from "../../types/types";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router";
import { useGetAllPackagesQuery } from "../../redux/api/packageApiSlice";

const CheckIn = () => {
  //checkIn
  const [memberId, setMemberId] = useState("");
  const [foundMember, setFoundMember] = useState<User | null>(null);
  const [foundMemberPlan, setFoundMemberPlan] = useState<string>("");
  const [packageExpires, setPackageExpires] = useState<string>("");
  const [isPackageActive, setPackageActive] = useState<boolean>(false);
  //renew
  const [gymPackage, setGymPackage] = useState<string>("");

  const { data: packages, isLoading: packagesLoading } =
    useGetAllPackagesQuery();
  const [checkInApiHandler, { isLoading }] = useCheckMembershipMutation();
  const [renewApiHandler, { isLoading: renewLoading }] =
    useRenewMembershipMutation();

  const navigate = useNavigate();

  const openUser = (id: string) => {
    navigate(`/member/${id}`);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await checkInApiHandler({ id: memberId }).unwrap();
      if (res.isActive) {
        toast.success(res.msg);
      } else {
        toast.error(res.msg);
      }
      setFoundMember(res.member);
      setPackageExpires(res.msg);
      setFoundMemberPlan(res.member.package.name);
      setPackageActive(res.isActive);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const renewMembershipHandler = async () => {
    try {
      const res = await renewApiHandler({
        id: foundMember!.userId,
        gymPackage: gymPackage,
      }).unwrap();
      setFoundMemberPlan(res.package);
      setPackageActive(true);
      setPackageExpires(`Package Expires on ${res.newExpirationDate}`);
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (packagesLoading) {
    return <Loader />;
  }

  return (
    <section>
      <h1 className="font-semibold text-xl text-center">Check Membership</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col max-w-[300px] mx-auto my-4"
      >
        <input
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          type="text"
          placeholder="Enter Id"
          className="border border-gray-300 rounded px-2 py-2"
        />
        <button
          disabled={isLoading}
          className="bg-white text-black font-semibold rounded mt-4 py-1 cursor-pointer"
        >
          Check In
        </button>
      </form>
      {/* FOUND USER */}
      {isLoading && <Loader />}
      {foundMember && (
        <div className="w-fit mx-auto flex flex-col justify-center">
          <div className=" flex  justify-center gap-2 mt-8 sm:flex-row flex-col ">
            {/* Found user image */}
            <img
              onClick={() => openUser(foundMember.userId)}
              className="w-[250px] h-[250px] object-cover rounded cursor-pointer"
              src={
                foundMember.profilePicture === ""
                  ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
                  : foundMember.profilePicture
              }
              alt="Found Member Profile Picture"
            />
            {/* Found user info */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-semibold">Name :</span>{" "}
                <span className="text-gray-200">{foundMember.fullName}</span>
              </p>
              <p>
                <span className="font-semibold">Email :</span>{" "}
                <span className="text-gray-200">{foundMember.email}</span>
              </p>
              <p>
                <span className="font-semibold">Package :</span>{" "}
                <span className="text-gray-200">{foundMemberPlan}</span>
              </p>
              <p className="w-60">
                <span className="font-semibold">Note :</span>{" "}
                <span className="text-gray-200 text-xs ">
                  {foundMember.note === "" ? "No Note" : foundMember.note}
                </span>
              </p>

              <p className="mt-auto">
                <span
                  className={`${
                    isPackageActive ? "text-cyan-600" : "text-red-600"
                  }`}
                >
                  {packageExpires}
                </span>
              </p>
            </div>
          </div>
          {!isPackageActive && (
            <div className="mt-6 flex flex-col gap-4">
              <select
                value={gymPackage}
                onChange={(e) => setGymPackage(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option className="bg-[var(--grayLight)]" value="">
                  Select Package
                </option>
                {packages?.packages.map((gymPackage) => (
                  <option
                    className="bg-[var(--grayLight)]"
                    value={gymPackage._id}
                  >
                    {gymPackage.name}
                  </option>
                ))}
              </select>
              <button
                disabled={renewLoading}
                onClick={renewMembershipHandler}
                className="bg-white text-black font-semibold py-1  w-full rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Renew
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
export default CheckIn;
