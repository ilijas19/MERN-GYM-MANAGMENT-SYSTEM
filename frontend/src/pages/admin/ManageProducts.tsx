import ProductTable from "../../components/ProductTable";

const ManageProducts = () => {
  return (
    <section>
      <div className="flex items-center sm:flex-row flex-col justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
      </div>
      <ProductTable />
    </section>
  );
};
export default ManageProducts;
