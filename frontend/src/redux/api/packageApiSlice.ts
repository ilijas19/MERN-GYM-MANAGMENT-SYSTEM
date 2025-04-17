import {
  CreatePackageArg,
  MessageRes,
  Package,
  UpdatePackageArg,
} from "../../types/types";
import { PACKAGE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const packageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPackage: builder.mutation<MessageRes, CreatePackageArg>({
      query: ({ name, price, duration }) => ({
        url: `${PACKAGE_URL}`,
        method: "POST",
        body: { name, price, duration },
      }),
    }),
    getAllPackages: builder.query<{ packages: Package[] }, void>({
      query: () => ({
        url: `${PACKAGE_URL}`,
      }),
    }),
    getSinglePackage: builder.query<{ package: Package }, string>({
      query: (id) => ({
        url: `${PACKAGE_URL}/${id}`,
      }),
    }),
    updatePackage: builder.mutation<MessageRes, UpdatePackageArg>({
      query: ({ id, data }) => ({
        url: `${PACKAGE_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deletePackage: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${PACKAGE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useGetSinglePackageQuery,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApiSlice;
