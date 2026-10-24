import ProductList from "./pages/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PrivateRouter from "./components/privateRouter";
import Login from "./pages/login";
import Signup from "./pages/Signup";
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id/" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<PrivateRouter />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
