import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      setMenuItems(res.data);
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const categories = ["All", "Appetizers", "Drinks", "Main Course"];

  const filteredMenu = menuItems.filter((item) =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* ✅ Main Content with Order Summary on the Right */}
      <div className="flex w-full p-6 mt-16">
        
        {/* 🍽️ Menu Section - Left Side */}
        <div className="w-3/4 pr-6">
          <h1 className="text-3xl font-bold text-center mb-4">🍽️ Restaurant POS</h1>

          {/* 🔍 Search Bar */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-lg text-lg transition ${
                  selectedCategory === category ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 🟦 Menu Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMenu.length === 0 ? (
              <p className="text-gray-500 text-center col-span-4">No menu items found.</p>
            ) : (
              filteredMenu.map((item) => (
                <div key={item._id} className="p-6 bg-white shadow-lg rounded-lg text-center">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-lg font-semibold">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🛒 Order Summary - Right Side */}
        <div className="w-1/4 bg-white shadow-xl rounded-lg p-6 sticky top-20 mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            🛒 Order Summary
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item._id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  {item.name} x {item.quantity} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total:</span>
            <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          {cart.length > 0 && (
            <Link to="/checkout" state={{ cart }}>
              <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 text-lg transition">
                Proceed to Checkout
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
