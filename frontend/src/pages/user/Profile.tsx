import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import {
  useGetCurrentUserProfileQuery,
  useUploadProfilePictureMutation,
  useUpdateProfileInfoMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { isApiError } from "../../utils/isApiError";
import Modal from "../../components/Modal";
import UpdatePasswordForm from "../../components/forms/Member/UpdatePasswordForm";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";

const Profile = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const { data: user, isLoading, refetch } = useGetCurrentUserProfileQuery();

  const [uploadApiHandler, { isLoading: uploadLoading }] =
    useUploadProfilePictureMutation();
  const [updateInfoApiHandler, { isLoading: updateInfoLoading }] =
    useUpdateProfileInfoMutation();
  const [logoutApiHandler, { isLoading: logoutLoading }] = useLogoutMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      const res = await updateInfoApiHandler({
        fullName,
        email,
        profilePicture,
      }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    } finally {
      setEdit(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutApiHandler().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      toast.success(res.msg);
      navigate("/login", { replace: true });
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleCancel = () => {
    setFullName(user?.user.fullName || "");
    setEmail(user?.user.email || "");
    setProfilePicture(user?.user.profilePicture || "");
    setEdit(false);
  };

  useEffect(() => {
    setFullName(user?.user.fullName ?? "");
    setEmail(user?.user.email ?? "");
    setProfilePicture(user?.user.profilePicture ?? "");
  }, [user]);

  ///
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadApiHandler(formData).unwrap();
        toast.success(res.msg);
        setProfilePicture(res.url);
        console.log(res.url);

        console.log(profilePicture);
      } catch (error) {
        if (isApiError(error)) {
          toast.success(error.data.msg);
        } else {
          toast.success("Something Went Wrong");
        }
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="max-w-[900px] mx-auto">
      <h2 className="text-lg">
        Welcome, <span className="font-semibold">{user?.user.fullName}</span>
      </h2>
      <p className="text-gray-500">{user?.user.role}</p>
      <div className="mx-6 mt-4 flex items-center gap-3 profile-header">
        {/* Profile Picture */}
        {edit ? (
          <label className="relative w-24 h-24 cursor-pointer">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
            />
            <img
              src={
                profilePicture ||
                "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
              }
              alt="profile picture"
              className="bg-gray-600 w-24 h-24 rounded-full object-cover border-2 border-gray-400"
            />
            <div className="absolute inset-0 bg-black opacity-80 flex items-center justify-center text-white text-sm font-semibold rounded-full">
              {uploadLoading ? (
                <div className="mb-8">
                  <Loader />
                </div>
              ) : (
                "Upload"
              )}
            </div>
          </label>
        ) : (
          <img
            src={
              profilePicture ||
              "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
            }
            alt="profile picture"
            className="bg-gray-600 w-24 h-24 rounded-full object-cover"
          />
        )}

        {/* User Info */}
        <ul className="flex flex-col gap-1">
          <p className="font-semibold text-lg">{user?.user.fullName}</p>
          <p className="text-gray-500">{user?.user.email}</p>
        </ul>

        {/* Edit / Save */}
        {edit ? (
          <div className="ml-auto flex gap-2 button-div">
            <button
              onClick={handleSave}
              disabled={uploadLoading || updateInfoLoading}
              className="ml-auto bg-cyan-600  font-semibold px-4 py-0.5 rounded-md  hover:bg-cyan-700 transition-all duration-250 cursor-pointer button-div text-black"
            >
              Save
            </button>
            <button
              disabled={uploadLoading || updateInfoLoading}
              onClick={handleCancel}
              className=" bg-red-600 text-white font-semibold px-3 py-0.5 rounded-md cursor-pointer hover:bg-red-700 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="ml-auto bg-cyan-600 text-black font-semibold px-4 py-0.5 rounded-md  hover:bg-cyan-700 transition-all duration-250 cursor-pointer button-div"
          >
            Edit
          </button>
        )}
      </div>

      {/* FORM */}
      <form className="mx-6 mt-8 grid sm:grid-cols-2  grid-cols-1 gap-x-8 sm:gap-y-5 gap-y-3 place-items-center profile-form">
        <div className="flex flex-col  w-full gap-1">
          <label>Full Name</label>
          <input
            type="text"
            className={`border  rounded px-2 py-1 outline-none ${
              edit ? "border-white text-white" : "border-gray-600 text-gray-400"
            }`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!edit}
          />
        </div>
        <div className="flex flex-col  w-full gap-1">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!edit}
            className={`border  rounded px-2 py-1 outline-none ${
              edit ? "border-white text-white" : "border-gray-600 text-gray-400"
            }`}
          />
        </div>
        <div className="flex flex-col  w-full gap-1">
          <label>User Id</label>
          <input
            disabled
            type="text"
            className="border border-gray-600 rounded px-2 py-1"
            placeholder={user?.user.userId}
          />
        </div>
        <div className="flex flex-col  w-full gap-1">
          <label>Role</label>
          <input
            disabled
            type="text"
            placeholder={user?.user.role}
            className="border border-gray-600 rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col  w-full gap-1">
          <label>Membership Expires</label>
          <input
            disabled
            type="text"
            placeholder={
              user?.user.role === "Member"
                ? user.user.membershipExpDate.toString().split("T")[0]
                : user?.user.role
            }
            className="border border-gray-600 rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col  w-full gap-1">
          <label>Joined</label>
          <input
            disabled
            type="text"
            placeholder={user?.user.createdAt.toString().split("T")[0]}
            className="border border-gray-600 rounded px-2 py-1"
          />
        </div>
        <button
          className="bg-cyan-600 text-black font-semibold px-3 py-0.5 rounded  w-full cursor-pointer hover:bg-gray-200"
          onClick={() => setPasswordModalOpen(true)}
          type="button"
        >
          Update Password ?
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="bg-red-500  font-semibold px-3 py-0.5 rounded  cursor-pointer hover:bg-red-600 w-full"
        >
          Logout
        </button>
      </form>

      <div className="mx-6 mt-6">
        <p className="text-lg">Personal Trainer</p>
        <p className="text-gray-500">
          {user?.user.trainer && typeof user.user.trainer === "object"
            ? user.user.trainer.fullName
            : "No Personal Trainer"}
        </p>
      </div>
      <Modal
        isModalOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        {<UpdatePasswordForm onClose={() => setPasswordModalOpen(false)} />}
      </Modal>
    </section>
  );
};
export default Profile;
