import { useParams } from "react-router";
import { useGetSingleProductQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";

const ProductPage = () => {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useGetSingleProductQuery(id || "");

  console.log(product?.product);

  if (isError) {
    return (
      <h1 className="text-center text-2xl text-red-500 mt-10">
        Error 404 - Product Not Found
      </h1>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  const { name, image, price, countInStock, createdAt, productId } =
    product!.product;

  return (
    <section className="w-full max-w-4xl mx-auto mt-10 px-4">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 place-items-center">
        <img
          src={image}
          alt={name}
          className="w-full max-w-md h-auto rounded-xl shadow-md object-cover"
        />
        <div className="text-lg flex flex-col gap-4 w-full">
          <h2 className="text-3xl font-bold text-cyan-600">{name}</h2>
          <p>
            <span className="font-semibold">ID :</span> {productId}
          </p>
          <p>
            <span className="font-semibold">Price :</span> ${price}
          </p>
          <p>
            <span className="font-semibold">In Stock :</span>{" "}
            {countInStock > 0 ? (
              <span className="text-green-500">Yes ({countInStock})</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>
          <p>
            <span className="font-semibold">Created At :</span>{" "}
            {createdAt.toString().split("T")[0]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
