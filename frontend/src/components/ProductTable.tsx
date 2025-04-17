import { FaEdit, FaTrash } from "react-icons/fa";
import { useGetAllProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { useState } from "react";
import { Product } from "../types/types";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Modal from "./Modal";
import FiltersForm from "./forms/product/FiltersForm";
import CreateProductForm from "./forms/product/CreateProductForm";
import UpdateProductForm from "./forms/product/UpdateProductForm";
import DeleteProductForm from "./forms/product/DeleteProductForm";

export type ProductFilters = {
  page: number;
  name: string;
  priceGte: number | undefined;
  priceLte: number | undefined;
};

const ProductTable = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    name: "",
    priceGte: undefined,
    priceLte: undefined,
  });

  const [isFilterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [isAddProductModalOpen, setAddProductModalOpen] =
    useState<boolean>(false);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [updatingProduct, setUpdatingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    refetch,
  } = useGetAllProductsQuery({ ...filters });

  const { currentUser } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const openProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleProductUpdate = (product: Product) => {
    setUpdatingProduct(product);
    setUpdateModalOpen(true);
  };
  const handleProductDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="mt-8 max-w-[800px] mx-auto flex justify-between mb-2">
        <button
          hidden={currentUser?.role !== "Admin"}
          onClick={() => setAddProductModalOpen(true)}
          className="bg-cyan-600 font-semibold text-black rounded px-2 py-0.5 cursor-pointer"
        >
          Add Product
        </button>
        <button
          onClick={() => setFilterModalOpen(true)}
          className="bg-white font-semibold text-black rounded px-2 py-0.5 cursor-pointer"
        >
          Filters
        </button>
      </div>
      <div className="overflow-x-scroll hide-scrollbar max-w-[800px] mx-auto ">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-gray-600 py-2.5">ID</th>
              <th className="border border-gray-600 py-2.5">Name</th>
              <th className="border border-gray-600 py-2.5">Price</th>
              <th className="border border-gray-600 py-2.5">InStock</th>
              <th className="border border-gray-600 py-2.5 w-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.products.map((product) => (
              <tr key={product.productId}>
                <td
                  onClick={() => openProduct(product.productId)}
                  className={`border border-gray-700 text-cyan-600 text-center py-3 px-5 text-nowrap hover:underline cursor-pointer`}
                >
                  {product.productId}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap">
                  {product.name}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap">
                  {product.price} $
                </td>
                <td
                  className={`border border-gray-700  text-center py-2 px-5 text-nowrap `}
                >
                  {product.countInStock}
                </td>
                <td className="border border-gray-700 text-gray-200 text-center py-2 px-5 text-nowrap ">
                  <div className="flex justify-center gap-3 items-center">
                    <FaEdit
                      onClick={() => {
                        if (currentUser!.role === "Admin") {
                          handleProductUpdate(product);
                        }
                      }}
                      size={18}
                      className={`text-gray-200 ${
                        currentUser!.role === "Admin"
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                    />
                    <FaTrash
                      onClick={() => {
                        if (currentUser!.role === "Admin") {
                          handleProductDelete(product);
                        }
                      }}
                      size={17}
                      className={`text-red-600 ${
                        currentUser!.role === "Admin"
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            filters.page <= 1 ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>
        <button
          disabled={filters.page === products?.totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className={`bg-[var(--grayLight)] px-3 py-0.5 rounded font-semibold cursor-pointer transition-opacity duration-300 ${
            !products?.nextPage ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
      {/* FILTER PRODUCTS MODAL */}
      <Modal
        isModalOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      >
        <FiltersForm
          filters={filters}
          setFilters={setFilters}
          onClose={() => setFilterModalOpen(false)}
        />
      </Modal>
      {/* ADD PRODUCT MODAL */}
      <Modal
        isModalOpen={isAddProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
      >
        <CreateProductForm
          onClose={() => setAddProductModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
      {/* UPDATE PRODUCT MODAL */}
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdateProductForm
          refetch={refetch}
          updatingProduct={updatingProduct}
          onClose={() => setUpdateModalOpen(false)}
        />
      </Modal>
      {/* DELETE PRODUCT MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteProductForm
          deletingProduct={deletingProduct}
          onClose={() => setDeleteModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
    </>
  );
};
export default ProductTable;
