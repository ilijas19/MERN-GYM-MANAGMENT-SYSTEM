import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";

const PrivateRoute = () => {
  const { data: currentUser, isLoading, refetch } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser.currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
export default PrivateRoute;
