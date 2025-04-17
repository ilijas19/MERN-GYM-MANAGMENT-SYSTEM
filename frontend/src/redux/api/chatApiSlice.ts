import {
  CreateChatRes,
  GetAllChatsRes,
  GetChatMessagesRes,
  MessageRes,
} from "../../types/types";
import { CHAT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<CreateChatRes, string>({
      query: (memberId) => ({
        url: `${CHAT_URL}`,
        method: "POST",
        body: { memberId },
      }),
    }),
    getAllChats: builder.query<GetAllChatsRes, void>({
      query: () => ({
        url: `${CHAT_URL}`,
        method: "GET",
      }),
    }),
    getChatMessages: builder.query<GetChatMessagesRes, string>({
      query: (id) => ({
        url: `${CHAT_URL}/${id}`,
      }),
    }),
    deleteChat: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${CHAT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetAllChatsQuery,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
} = chatApiSlice;
