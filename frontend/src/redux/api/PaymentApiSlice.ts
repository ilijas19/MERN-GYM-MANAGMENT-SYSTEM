import {
  GetSinglePackageRevenueRes,
  TotalPackagesRevenue,
  AllPPaymentsRes,
  AllPPaymentsArg,
  AllProductPaymentRes,
  AllProdRes,
  CreateProductPayArg,
  GetSingleProductPayRes,
  TotalRevenueRes,
  CreProdPayRes,
} from "../../types/types";
import { PACKAGE_PAYMENT_URL, PRODUCT_PAYMENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------------
    //PRODUCT PAYMENTS
    // ------------------------------------------------
    createProductPayment: builder.mutation<CreProdPayRes, CreateProductPayArg>({
      query: ({ items, totalPrice }) => ({
        url: `${PRODUCT_PAYMENT_URL}`,
        method: "POST",
        body: { items, totalPrice },
      }),
    }),
    getAllProductPayments: builder.query<AllProductPaymentRes, AllProdRes>({
      query: ({ page = 1 }) => ({
        url: `${PRODUCT_PAYMENT_URL}?page=${page}`,
      }),
    }),
    getSingleProductPayment: builder.query<GetSingleProductPayRes, string>({
      query: (id) => ({
        url: `${PRODUCT_PAYMENT_URL}/${id}`,
      }),
    }),
    getTotalProductsRevenue: builder.query<TotalRevenueRes, void>({
      query: () => ({
        url: `${PRODUCT_PAYMENT_URL}/total`,
      }),
    }),
    getMonthProductsRevenue: builder.query<TotalRevenueRes, void>({
      query: () => ({
        url: `${PRODUCT_PAYMENT_URL}/month`,
      }),
    }),
    // ------------------------------------------------
    //PACKAGE PAYMENTS
    // ------------------------------------------------
    getAllPackagePayments: builder.query<AllPPaymentsRes, AllPPaymentsArg>({
      query: ({ page = 1 }) => ({
        url: `${PACKAGE_PAYMENT_URL}?page=${page}`,
      }),
    }),
    getSinglePackageRevenue: builder.query<GetSinglePackageRevenueRes, string>({
      query: (id) => ({
        url: `${PACKAGE_PAYMENT_URL}/${id}`,
      }),
    }),
    getTotalPackagesRevenue: builder.query<TotalPackagesRevenue, void>({
      query: () => ({
        url: `${PACKAGE_PAYMENT_URL}/total`,
      }),
    }),
    getMonthlyPackageRevenue: builder.query<TotalPackagesRevenue, void>({
      query: () => ({
        url: `${PACKAGE_PAYMENT_URL}/month`,
      }),
    }),
  }),
});

//products payment
export const {
  useCreateProductPaymentMutation,
  useGetAllProductPaymentsQuery,
  useGetSingleProductPaymentQuery,
  useGetTotalProductsRevenueQuery,
  useGetMonthProductsRevenueQuery,
} = paymentApiSlice;

//package payments
export const {
  useGetAllPackagePaymentsQuery,
  useGetSinglePackageRevenueQuery,
  useGetTotalPackagesRevenueQuery,
  useGetMonthlyPackageRevenueQuery,
} = paymentApiSlice;
