import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import {
  CreateProductArg,
  getAllProductsArg,
  getAllProductsRes,
  MessageRes,
  Product,
  UpdateProductArg,
} from "../../types/types";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<getAllProductsRes, getAllProductsArg>({
      query: ({ page = 1, name = "", priceGte = "", priceLte = "" }) => ({
        url: `${PRODUCT_URL}?page=${page}&name=${name}&priceGte=${priceGte}&priceLte=${priceLte}`,
      }),
    }),
    createProduct: builder.mutation<MessageRes, CreateProductArg>({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getSingleProduct: builder.query<{ product: Product }, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
    }),
    updateProduct: builder.mutation<MessageRes, UpdateProductArg>({
      query: ({ id, data }) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    uploadImage: builder.mutation<{ msg: string; url: string }, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
} = productApiSlice;
