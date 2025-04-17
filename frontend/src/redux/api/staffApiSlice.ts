import {
  CheckMembershipRes,
  getAllUsersArg,
  getAllUsersRes,
  GetSingleMemberRes,
  MessageRes,
  RegisterMemberArg,
  RegisterMemberRes,
  RenewMembershipArg,
  RenewMembershipRes,
  UpdateMemberArg,
} from "../../types/types";
import { STAFF_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const staffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMembers: builder.query<getAllUsersRes, getAllUsersArg>({
      query: ({ page = 1, fullName = "", gymPackage = "", active }) => ({
        url: `${STAFF_URL}?page=${page}&fullName=${fullName}&package=${gymPackage}&active=${active}`,
      }),
    }),
    registerMember: builder.mutation<RegisterMemberRes, RegisterMemberArg>({
      query: ({ fullName, email, gymPackage }) => ({
        url: `${STAFF_URL}`,
        method: "POST",
        body: { fullName, email, gymPackage },
      }),
    }),
    getSingleMember: builder.query<GetSingleMemberRes, string>({
      query: (id) => ({
        url: `${STAFF_URL}/member/${id}`,
      }),
    }),
    checkMembership: builder.mutation<CheckMembershipRes, { id: string }>({
      query: ({ id }) => ({
        url: `${STAFF_URL}/membership/check`,
        method: "POST",
        body: { id },
      }),
    }),
    renewMembership: builder.mutation<RenewMembershipRes, RenewMembershipArg>({
      query: ({ id, gymPackage }) => ({
        url: `${STAFF_URL}/membership/${id}`,
        method: "POST",
        body: { gymPackage },
      }),
    }),
    updateMember: builder.mutation<MessageRes, UpdateMemberArg>({
      query: ({ fullName, email, note, id }) => ({
        url: `${STAFF_URL}/member/${id}`,
        method: "PATCH",
        body: { fullName, email, note },
      }),
    }),
    deleteMember: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${STAFF_URL}/member/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useRegisterMemberMutation,
  useGetSingleMemberQuery,
  useCheckMembershipMutation,
  useRenewMembershipMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = staffApiSlice;
