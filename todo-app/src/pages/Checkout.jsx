import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerSearch from "./CustomerSearch";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderType, setOrderType] = useState("Dine-In");
  const [tableNumber, setTableNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Calculate total price with promo discount
  const subtotal = cart.length > 0 ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const totalPrice = (subtotal - promoDiscount).toFixed(2);

  // ✅ Assign customer name only (No Loyalty Discount)
  const selectCustomer = (selectedCustomer) => {
    setCustomer(selectedCustomer);
  };

  const applyPromoCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/promos/apply", { code: promoCode });
      setPromoDiscount((subtotal * res.data.discount) / 100);
      setErrorMessage(""); // ✅ Clear error message on success
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error applying promo code");
    }
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (orderType === "Dine-In" && !tableNumber) {
      alert("Please enter a table number.");
      return;
    }

    try {
      const orderRes = await axios.post("http://localhost:5000/api/orders", {
        tableNumber: orderType === "Dine-In" ? tableNumber : null,
        orderType,
        customerName: customer ? customer.name : "Guest", // ✅ Assign customer name
        items: cart,
        total: totalPrice,
        paymentMethod,
      });

      alert(orderRes.data.message);
      navigate("/receipt", { state: { order: orderRes.data.order } });
    } catch (error) {
      alert(error.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen mt-16 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>

        {/* ✅ Customer Search & Assign Name (No Loyalty Discount) */}
        <CustomerSearch onSelectCustomer={selectCustomer} />

        {customer && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h3 className="font-semibold">Customer: {customer.name}</h3>
            <p>Contact: {customer.contact}</p>
          </div>
        )}

        {/* ✅ Promo Code Input */}
        <div className="mb-4 mt-6">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={applyPromoCode}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Apply Promo Code
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Order Summary:</h3>
          {cart.length > 0 ? cart.map((item, index) => (
            <p key={index}>{item.name} x {item.quantity} - ${item.price.toFixed(2)}</p>
          )) : <p className="text-gray-500">No items in cart.</p>}
          <p className="font-bold mt-2">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="font-bold text-blue-600">Promo Code Discount: -${promoDiscount.toFixed(2)}</p>
          <p className="font-bold mt-2 text-xl">Total: ${totalPrice}</p>
        </div>

        <label className="block mb-2">Select Order Type:</label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="Dine-In">Dine-In</option>
          <option value="Takeout">Takeout</option>
          <option value="Online">Online</option>
        </select>

        {orderType === "Dine-In" && (
          <input
            type="number"
            placeholder="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
        )}

        <label className="block mb-2">Select Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>

        <button
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          onClick={handlePayment}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
