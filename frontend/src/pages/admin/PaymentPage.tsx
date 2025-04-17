import { useParams } from "react-router";
import { useGetSingleProductPaymentQuery } from "../../redux/api/PaymentApiSlice";
import Loader from "../../components/Loader";

const PaymentPage = () => {
  const { id } = useParams();
  const {
    data: payment,
    isLoading,
    isError,
  } = useGetSingleProductPaymentQuery(id ?? "");

  if (isError) {
    return (
      <h1 className="text-red-500 text-center mt-8">
        ERROR 404 - Payment not found
      </h1>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!payment) {
    return <div className="text-center mt-8">No payment data available</div>;
  }

  const formattedDate = payment.payment.createdAt.toString().split("T")[0];

  return (
    <section className="max-w-4xl mx-auto p-4 md:p-6">
      <div className=" rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold">Payment Receipt</h2>
          <div className="flex justify-between items-center mt-2 text-sm md:text-base">
            <span>Payment ID: {payment.payment._id}</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Items */}
        <div className="p-4 md:p-6 border-b b">
          <h3 className="text-lg font-semibold mb-4">Items Purchased</h3>
          {payment.payment.items.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full md:w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right font-medium">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>${payment.payment.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t">
            <span>Total:</span>
            <span>${payment.payment.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Staff info */}
        <div className="p-4 md:p-6 border-t">
          <h3 className="text-lg font-semibold mb-2">Processed By</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
              {payment.payment.workingStaffMember.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-medium">
                {payment.payment.workingStaffMember.fullName}
              </p>
              <p className="text-sm text-gray-600">
                Staff ID: {payment.payment.workingStaffMember.userId}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-800 p-4 text-center text-sm ">
          Thank you for your purchase!
        </div>
      </div>

      {/* Print button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Print Receipt
        </button>
      </div>
    </section>
  );
};

export default PaymentPage;
