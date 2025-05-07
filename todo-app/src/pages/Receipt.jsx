import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; // Ensure `order` exists

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-bold text-red-500">No order data available.</h2>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    setTimeout(() => {
      navigate("/dashboard"); // ✅ Redirect to Dashboard after printing
    }, 500); // Short delay to allow print dialog to appear
  };

  return (
    <div className="min-h-screen mt-16 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Receipt</h2>

        <div className="text-left">
          <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod ? order.paymentMethod.toUpperCase() : "N/A"}</p>

          <h3 className="mt-4 font-semibold">Items:</h3>
          {order.items.map((item, index) => (
            <p key={index}>{item.name} x {item.quantity} - ${item.price.toFixed(2)}</p>
          ))}

          <p className="font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
        </div>

        {/* ✅ Auto-Redirect after Printing */}
        <button
          onClick={handlePrint}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}
