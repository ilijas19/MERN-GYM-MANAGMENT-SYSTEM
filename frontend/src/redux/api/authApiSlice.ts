import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants";
import {
  CurrentUserRes,
  LoginArg,
  LoginRes,
  MessageRes,
} from "../../types/types";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, LoginArg>({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
    }),
    getCurrentUser: builder.query<CurrentUserRes, void>({
      query: () => ({
        url: `${AUTH_URL}/me`,
      }),
    }),
    logout: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } =
  usersApiSlice;
