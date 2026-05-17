import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, deleteListing } from "../../services/productService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // stats removed: orders/payments are handled off-system per SRS
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  // If navigated here with a refetch flag, reload listings
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.refetch) {
      loadDashboardData();
    }
  }, [location.state]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch products (no auth required)
      let productRes;
      try {
        productRes = await getProducts();
        console.log("Product response:", productRes);
      } catch (prodErr) {
        console.error("Error loading products:", prodErr);
        throw new Error("Failed to load products: " + (prodErr.response?.data?.message || prodErr.message));
      }


      // Handle Product Data - axios wraps in .data property
      let products = productRes.data || productRes;
      // If products is an object with data property, extract it
      if (products && typeof products === 'object' && products.data && !Array.isArray(products)) {
        products = products.data;
      }
      setProducts(Array.isArray(products) ? products : []);

      // No on-platform sales data: stats are handled manually off-system.

      setLoading(false);
    } catch (err) {
      console.error("Dashboard error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load dashboard data";
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteListing(id);
        setProducts(products.filter((p) => p.id !== id));
        alert("Listing deleted successfully");
      } catch (err) {
        alert("Error deleting listing: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="admin-dashboard" style={{ padding: "20px" }}>
      <h1 style={{textAlign:"center", margin:"2rem"}}>OVERVIEW</h1>
      {error && <p style={{ color: "red", backgroundColor: "#ffe6e6", padding: "15px", borderRadius: "5px", marginBottom: "15px" }}>❌ {error}</p>}
      <div style={{display:"flex", gap:"4rem"}}>

        <div  style={{ flex: 1, padding: "20px", background: "#f8f9fa", borderRadius: "10px", borderLeft: "5px solid #007bff" }}>
          <p style={{ margin: 0, color: "#666" }}>Listings Managed</p>
          <h3 style={{ fontSize: "1.8rem" }}>{products.length} listings</h3>
        </div>

      </div>
      
      
      

      <h1 style={{textAlign:"center", margin:"2rem"}}>MANAGE LISTINGS</h1>
      {loading && <p style={{ textAlign: "center", fontSize: "1.1rem" }}>⏳ Loading listings...</p>}
      {error && !loading && <p style={{ color: "red", backgroundColor: "#ffe6e6", padding: "15px", borderRadius: "5px", marginBottom: "15px" }}>❌ Failed to load listings: {error}</p>}
      {!loading && !error && products.length === 0 && <p style={{ textAlign: "center", color: "#666" }}>No listings found. <a href="/admin/create-listing" style={{ color: "#007bff" }}>Create one now</a></p>}

      {!loading && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Price</th>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                      alt="" 
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} 
                    />
                  ) : (
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#ddd", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>No image</div>
                  )}
                </td>
                <td style={{ padding: "12px" }}>{product.title}</td>
                <td style={{ padding: "12px" }}>Le {product.price}</td>
                <td style={{ padding: "12px" }}>{product.category}</td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => navigate(`/admin/edit-listing/${product.id}`)}
                    style={{
                      backgroundColor: "#28a745", color: "white", border: "none",
                      padding: "8px 12px", borderRadius: "5px", cursor: "pointer", marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.title)}
                    style={{
                      backgroundColor: "#dc3545", color: "white", border: "none",
                      padding: "8px 12px", borderRadius: "5px", cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {!loading && products.length === 0 && <p>No listings found.</p>}
    </div>
  );
}