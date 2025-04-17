import { useState } from "react";
import { useGetSingleProductQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useCreateProductPaymentMutation } from "../../redux/api/PaymentApiSlice";
import { useNavigate } from "react-router";
import ProductTable from "../../components/ProductTable";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const CreateOrder = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const { data: p, isLoading, isError } = useGetSingleProductQuery(searchId);
  const product = p?.product;
  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchId(inputValue.trim());
    }
  };

  const [createPaymentApiHandler, { isLoading: createPaymentLoading }] =
    useCreateProductPaymentMutation();

  const navigate = useNavigate();

  const handleAddToOrder = () => {
    if (product) {
      const existingItemIndex = orderItems.findIndex(
        (item) => item.productId === product._id
      );

      if (existingItemIndex >= 0) {
        return;
      } else {
        setOrderItems([
          ...orderItems,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
          },
        ]);
      }
      setQuantity(1);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePayment = async () => {
    try {
      const totalPrice = +calculateTotal();
      const items = orderItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));
      const res = await createPaymentApiHandler({ items, totalPrice }).unwrap();
      toast.success(res.msg);
      navigate(`/payment/${res.paymentId}`);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-white">
        Create Order
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Search Section */}
        <div className="bg-[var(--grayLight)] p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-xl font-medium mb-4 text-white">
            Search For Item
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border border-gray-600  text-white w-full rounded px-3 py-2 outline-none "
              placeholder="Enter Product ID"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-black font-semibold px-4 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>

          {isLoading && (
            <div className="mt-6 flex justify-center">
              <Loader />
            </div>
          )}

          {isError && (
            <div className="mt-4 p-3 bg-red-900 text-red-100 rounded">
              Product not found
            </div>
          )}

          {product && (
            <div className="mt-6 border border-gray-700 rounded-lg p-4 bg-gray-700">
              <div className="flex gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-white">{product.name}</h4>
                  <p className="text-gray-300">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">
                    In stock: {product.countInStock}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center border border-gray-600 rounded bg-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToOrder}
                  className="bg-gray-800 text-white px-4 py-1 rounded hover:bg-gray-900 transition-colors cursor-pointer"
                  disabled={product.countInStock < quantity}
                >
                  Add to Order
                </button>
              </div>
              {product.countInStock < quantity && (
                <p className="mt-2 text-red-400 text-sm">
                  Not enough items in stock
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Section */}
        <div className="bg-[var(--grayLight)] p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-xl font-medium mb-4 text-white">Current Order</h3>

          {orderItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No items added to order yet
            </p>
          ) : (
            <div>
              <div className="divide-y divide-gray-700">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-gray-300">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between font-semibold text-lg text-white">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button
                  onClick={handlePayment}
                  className="mt-4 w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition-colors"
                  disabled={orderItems.length === 0 || createPaymentLoading}
                >
                  Process Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <ProductTable />
      </div>
    </section>
  );
};

export default CreateOrder;
