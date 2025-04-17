import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";

const AdminRoute = () => {
  const { data: currentUser, isLoading, refetch } = useGetCurrentUserQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser && currentUser.currentUser.role === "Admin") {
      dispatch(setCurrentUser(currentUser.currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (currentUser && currentUser.currentUser.role === "Admin") {
    return <Outlet />;
  }

  if (currentUser && currentUser.currentUser.role !== "Admin") {
    return <Navigate to={"/"} replace />;
  }

  return <Navigate to={"/login"} replace />;
};
export default AdminRoute;
