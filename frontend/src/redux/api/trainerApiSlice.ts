import { Chat, GetAllClientsRes, MessageRes } from "../../types/types";
import { CHAT_URL, TRAINER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const trainerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClients: builder.query<GetAllClientsRes, void>({
      query: () => ({
        url: `${TRAINER_URL}`,
      }),
    }),
    addClient: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${TRAINER_URL}/${id}`,
        method: "POST",
      }),
    }),
    removeClient: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${TRAINER_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getTrainerChat: builder.query<{ chat: Chat }, void>({
      query: () => ({
        url: `${CHAT_URL}/trainerChat`,
      }),
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useAddClientMutation,
  useRemoveClientMutation,
  useGetTrainerChatQuery,
} = trainerApiSlice;
