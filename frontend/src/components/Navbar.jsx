import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { clearTokens, getAccessToken } from "../utils/auth";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Calculate total quantity in cart
  const cartCount = cartItems.reduce(
    (total, item) => total + (item._quantity ?? item.quantity ?? 0),
    0,
  );

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ MohitCart
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-800 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 text-gray-800 hover:text-blue-600"
        >
          <ShoppingCart size={20} />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
