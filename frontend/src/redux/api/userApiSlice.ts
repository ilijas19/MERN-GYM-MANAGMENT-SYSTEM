import {
  MessageRes,
  UpdateInfo,
  UpdatePassword,
  UploadRes,
  User,
} from "../../types/types";
import { UPLOAD_URL, USER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUserProfile: builder.query<{ user: User }, void>({
      query: () => ({
        url: `${USER_URL}/profile`,
      }),
    }),
    updateProfileInfo: builder.mutation<MessageRes, UpdateInfo>({
      query: (data) => ({
        url: `${USER_URL}/updateInfo`,
        method: "PATCH",
        body: data,
      }),
    }),
    updatePofilePassword: builder.mutation<MessageRes, UpdatePassword>({
      query: (data) => ({
        url: `${USER_URL}/updatePassword`,
        method: "PATCH",
        body: data,
      }),
    }),
    uploadProfilePicture: builder.mutation<UploadRes, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserProfileQuery,
  useUpdatePofilePasswordMutation,
  useUpdateProfileInfoMutation,
  useUploadProfilePictureMutation,
} = usersApiSlice;
