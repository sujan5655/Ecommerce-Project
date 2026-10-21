import { createContext, useContext, useEffect, useState } from "react";

// Create context outside CartProvider
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const fetchCart = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/cart/`);
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await res.json();
      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add Product to Cart
  // const addToCart = (product) => {
  //   setCartItems((prevItems) => {
  //     const existing = prevItems.find((item) => item.id === product.id);

  //     if (existing) {
  //       return prevItems.map((item) =>
  //         item.id === product.id
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item,
  //       );
  //     }

  //     return [...prevItems, { ...product, quantity: 1 }];
  //   });
  // };

  const addToCart = async (productid) => {
    try {
      await fetch(`${BASEURL}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productid }),
      });
      fetchCart();
    } catch (error) {
      console.log("Error adding to Cart", error);
    }
  };

  // Remove Product from Cart
  // const removeFromCart = (id) => {
  //   setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  // };

  const removeFromCart = async (itemId) => {
    try {
      await fetch(`${BASEURL}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  // Update Quantity
  // const updateQuantity = (id, quantity) => {
  //   if (quantity < 1) return;

  //   setCartItems((prevItems) =>
  //     prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
  //   );
  // };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    try {
      await fetch(`${BASEURL}/api/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => useContext(CartContext);
