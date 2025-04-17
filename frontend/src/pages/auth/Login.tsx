import { useEffect, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
} from "../../redux/api/authApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";
const Login = () => {
  const [loginApiHandler, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUserQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginApiHandler({ email, password }).unwrap();
      toast.success(res.msg);
      dispatch(setCurrentUser(res.tokenUser));

      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  const setAdminCred = () => {
    setEmail("ilijaprime@gmail.com");
    setPassword("12345");
  };
  const setStaffCred = () => {
    setEmail("staff@gmail.com");
    setPassword("18760");
  };
  const setTrainerCred = () => {
    setEmail("trainer@gmail.com");
    setPassword("86529");
  };
  const setMemberCred = () => {
    setEmail("member1@gmail.com");
    setPassword("48542");
  };

  if (currentUserLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[500px] mx-auto relative ">
      <h2 className="font-semibold text-center text-xl">Login</h2>
      <FiHelpCircle
        className="absolute right-0 top-0 cursor-pointer"
        size={23}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-0.5">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="border border-gray-700 rounded mb-2 px-2 py-0.5 outline-none"
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border border-gray-700 rounded mb-2 outline-none px-2 py-0.5"
        />
        <p className="text-sm text-gray-400">Forgot Password ?</p>
        <button
          disabled={isLoading}
          className="text-black font-semibold bg-white rounded py-0.5 mt-2 cursor-pointer transition-all duration-400 hover:text-white hover:bg-black border border-white"
        >
          Login
        </button>
        <p className="m-1 text-center">Role As</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={setAdminCred}
            className="bg-white text-black font-semibold px-2 rounded cursor-pointer"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={setStaffCred}
            className="bg-white text-black font-semibold px-2 rounded cursor-pointer"
          >
            Staff
          </button>
          <button
            type="button"
            onClick={setTrainerCred}
            className="bg-white text-black font-semibold px-2 rounded cursor-pointer"
          >
            Trainer
          </button>
          <button
            type="button"
            onClick={setMemberCred}
            className="bg-white text-black font-semibold px-2 rounded cursor-pointer"
          >
            Member
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
