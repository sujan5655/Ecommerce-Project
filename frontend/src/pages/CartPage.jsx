import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  console.log(cartItems);
  return (
    <div className="pt-20 min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your Cart is Empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                {item.product_image && (
                  <img
                    src={`${BASEURL}${item.product_image}`}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-3xl"
                  />
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold">{item.product_name}</h2>

                <p className="text-gray-600">Rs. {item.product_price}</p>

                <p className="text-sm text-gray-500">
                  Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total</h2>

            <p className="text-xl font-semibold">Rs. {total.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white transition duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
