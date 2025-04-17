import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import store from "./redux/store.ts";
import { Provider } from "react-redux";

import Login from "./pages/auth/Login.tsx";
import Home from "./pages/layout/Home.tsx";
import PrivateRoute from "./components/routes/PrivateRoute.tsx";
import Profile from "./pages/user/Profile.tsx";
import AdminRoute from "./components/routes/AdminRoute.tsx";
import ManageUsers from "./pages/admin/ManageUsers.tsx";
import StaffList from "./pages/admin/StaffList.tsx";
import TrainerList from "./pages/admin/TrainerList.tsx";
import StaffRoute from "./components/routes/StaffRoute.tsx";
import MemberList from "./pages/admin/MemberList.tsx";
import ManagePackages from "./pages/admin/ManagePackages.tsx";
import Payments from "./pages/admin/Payments.tsx";
import PackagePayments from "./pages/admin/PackagePayments.tsx";
import ManageProducts from "./pages/admin/ManageProducts.tsx";
import CheckIn from "./pages/staff/CheckIn.tsx";

import MemberProfile from "./pages/staff/MemberProfile.tsx";
import ProductPage from "./pages/staff/ProductPage.tsx";
import CreateMember from "./pages/staff/CreateMember.tsx";
import ProductPayments from "./pages/admin/ProductPayments.tsx";
import PaymentPage from "./pages/admin/PaymentPage.tsx";
import CreateOrder from "./pages/staff/CreateOrder.tsx";
import TrainerRoute from "./components/routes/TrainerRoute.tsx";
import AddClient from "./pages/trainer/AddClient.tsx";
import ManageClients from "./pages/trainer/ManageClients.tsx";
import ClientProfile from "./pages/trainer/ClientProfile.tsx";
import TrainerChat from "./pages/trainer/TrainerChat.tsx";
import TrainerMessages from "./pages/user/TrainerMessages.tsx";
import UserProfile from "./pages/admin/UserProfile.tsx";
import NotFound from "./pages/NotFound.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="trainer-messages" element={<TrainerMessages />} />
      </Route>

      <Route path="/" element={<AdminRoute />}>
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="staff-list" element={<StaffList />} />
        <Route path="trainer-list" element={<TrainerList />} />
        <Route path="manage-packages" element={<ManagePackages />} />
        <Route path="payments" element={<Payments />} />
        <Route path="packagePayments" element={<PackagePayments />} />
        <Route path="productPayments" element={<ProductPayments />} />
        <Route path="user/:id" element={<UserProfile />} />
      </Route>

      <Route path="/" element={<StaffRoute />}>
        <Route path="member/:id" element={<MemberProfile />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="member-list" element={<MemberList />} />
        <Route path="create-member" element={<CreateMember />} />
        <Route path="manage-products" element={<ManageProducts />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="payment/:id" element={<PaymentPage />} />
        <Route path="create-order" element={<CreateOrder />} />
      </Route>

      <Route path="/" element={<TrainerRoute />}>
        <Route path="client/:id" element={<ClientProfile />} />
        <Route path="add-client" element={<AddClient />} />
        <Route path="manage-clients" element={<ManageClients />} />
        <Route path="/messages" element={<TrainerChat />} />
        <Route />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
