import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  const { cartItems } = useCart();

  // Calculate the total number of products in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ MohitCart
      </Link>

      <Link
        to="/cart"
        className="relative flex items-center gap-2 text-gray-800 hover:text-gray-600"
      >
        <ShoppingCart size={20} />
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;
