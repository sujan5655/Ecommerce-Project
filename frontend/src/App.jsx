import ProductList from "../pages/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "../pages/ProductDetail";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
