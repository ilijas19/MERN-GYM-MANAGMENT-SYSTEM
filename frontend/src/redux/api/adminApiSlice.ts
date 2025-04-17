import { apiSlice } from "./apiSlice";
import { ADMIN_URL } from "../constants";
import {
  getAllUsersArg,
  getAllUsersRes,
  MessageRes,
  RegisterUserArgs,
  UpdateUserArgs,
  User,
} from "../../types/types";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<MessageRes, RegisterUserArgs>({
      query: (data) => ({
        url: `${ADMIN_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.query<getAllUsersRes, getAllUsersArg>({
      query: ({ page = 1, fullName = "", role = "", gymPackage = "" }) => ({
        url: `${ADMIN_URL}/users?page=${page}&fullName=${fullName}&role=${role}&gymPackage=${gymPackage}`,
      }),
    }),
    getUserById: builder.query<{ user: User }, string>({
      query: (id) => ({
        url: `${ADMIN_URL}/user/${id}`,
      }),
    }),
    updateUserById: builder.mutation<MessageRes, UpdateUserArgs>({
      query: ({ id, data }) => ({
        url: `${ADMIN_URL}/user/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUserById: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${ADMIN_URL}/user/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = adminApiSlice;
