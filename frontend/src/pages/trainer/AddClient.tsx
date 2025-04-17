import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useGetSingleMemberQuery } from "../../redux/api/staffApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { isMembershipValid } from "../../utils/isMembershipValid";
import { useAddClientMutation } from "../../redux/api/trainerApiSlice";

const AddClient = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const {
    data: foundUser,
    isLoading,
    isError,
    error,
  } = useGetSingleMemberQuery(selectedId, {
    skip: !selectedId,
  });

  const [addClientApiHandler, { isLoading: addClientLoading }] =
    useAddClientMutation();

  const handleSearch = () => {
    if (!inputValue.trim()) return toast.warning("Please enter a user ID.");
    setSelectedId(inputValue.trim());
  };

  const handleAddClient = async () => {
    try {
      const res = await addClientApiHandler(foundUser!.member.userId).unwrap();
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 p-4  rounded shadow">
      <h2 className="text-center text-xl mb-4">Add New Client</h2>

      {/* Search bar */}
      <div className="flex">
        <div className="relative flex-grow">
          <input
            value={inputValue}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            className="w-full border border-gray-600 px-4 py-2 rounded-l pl-10"
            placeholder="Enter User Id"
          />
          <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button
          onClick={handleSearch}
          className="bg-white text-black font-semibold px-4 py-2 rounded-r hover:bg-gray-100 transition"
        >
          Search
        </button>
      </div>

      {/* Loading state */}
      {isLoading && <Loader />}

      {/* Error state */}
      {isError && isApiError(error) && (
        <p className="text-red-500 mt-4">
          {error.data.msg || "User not found"}
        </p>
      )}

      {/* Found user display */}
      {foundUser && (
        <div className="mt-6 p-4  rounded  shadow-sm space-y-2">
          <div className="flex items-center gap-4">
            <img
              src={foundUser.member.profilePicture}
              alt={foundUser.member.fullName}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <p className="font-bold text-lg">{foundUser.member.fullName}</p>
              <p className="text-sm text-gray-600">{foundUser.member.email}</p>
            </div>
          </div>
          <p className="text-cyan-600 font-semibold">
            <span className="font-semibold text-white">User ID :</span>{" "}
            {foundUser.member.userId}
          </p>
          <p>
            <span className="font-semibold">Role :</span>{" "}
            {foundUser.member.role}
          </p>
          <p>
            <span className="font-semibold">Package :</span>{" "}
            {foundUser.member.package?.name}
          </p>
          <p
            className={`${
              isMembershipValid(
                new Date(
                  foundUser.member.membershipExpDate
                ).toLocaleDateString()
              )
                ? "text-cyan-600"
                : "text-red-600"
            }`}
          >
            <span className="font-semibold text-white">
              Membership Expires :
            </span>{" "}
            {new Date(foundUser.member.membershipExpDate).toLocaleDateString()}
          </p>
          {foundUser.member.note && (
            <p>
              <span className="font-semibold">Note:</span>{" "}
              {foundUser.member.note}
            </p>
          )}
          <button
            disabled={addClientLoading}
            onClick={handleAddClient}
            className="bg-white text-black w-full font-semibold rounded mt-2 cursor-pointer"
          >
            Add Client
          </button>
        </div>
      )}
    </section>
  );
};

export default AddClient;
