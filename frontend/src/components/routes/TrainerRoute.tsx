import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";

const TrainerRoute = () => {
  const { data: currentUser, isLoading, refetch } = useGetCurrentUserQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      (currentUser && currentUser.currentUser.role === "Trainer") ||
      (currentUser && currentUser.currentUser.role === "Admin")
    ) {
      dispatch(setCurrentUser(currentUser.currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  if (
    (currentUser && currentUser.currentUser.role === "Member") ||
    (currentUser && currentUser.currentUser.role === "Staff")
  ) {
    return <Navigate to={"/"} replace />;
  }

  if (
    (currentUser && currentUser.currentUser.role === "Trainer") ||
    (currentUser && currentUser.currentUser.role === "Admin")
  ) {
    return <Outlet />;
  }

  return <Navigate to={"/login"} replace />;
};
export default TrainerRoute;
