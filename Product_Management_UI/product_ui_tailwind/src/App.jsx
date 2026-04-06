import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import ProductList from "./pages/ProductList"
import AddProduct from "./pages/AddProduct"

function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        {/* Default route → redirect to products */}
        <Route path="/" element={<Navigate to="/products" />} />

        <Route path="/products" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />

      </Route>

    </Routes>
  )
}

export default App