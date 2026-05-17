import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateListing } from "../../services/productService";

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  console.log("EditListing component loaded. Product ID from URL:", id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
    studentName: "",
    studentContact: "",
    payoutMethod: "",
    privateNotes: "",
  });

  // Load existing product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Loading product with ID:", id);
        
        const response = await getProductById(id);
        console.log("Product response:", response);
        
        // Axios wraps response in .data property
        let product = response.data || response;
        
        // Handle case where response itself might have .data property
        if (product && product.data) {
          product = product.data;
        }
        
        if (!product || !product.title) {
          setError("Invalid product data received");
          setLoading(false);
          return;
        }
        
        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          image: null,
          studentName: product.studentName || "",
          studentContact: product.studentContact || "",
          payoutMethod: product.payoutMethod || "",
          privateNotes: product.privateNotes || "",
        });
        // Show current image as preview
        if (product.image) {
          const imageUrl = product.image.startsWith('http')
            ? product.image
            : `http://localhost:5000${product.image}`;
          setImagePreview(imageUrl);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        console.error("Error response:", err.response);
        const errorMsg = err.response?.data?.message || err.message || "Failed to load product data";
        setError(errorMsg);
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Show preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted! handleSubmit triggered");
    console.log("Current formData:", formData);
    console.log("Product ID:", id);
    
    // Check if token exists
    const token = localStorage.getItem("token");
    console.log("Token check:", {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 30) + "..." : "NO TOKEN IN LOCALSTORAGE"
    });
    
    if (!token) {
      setError("No authentication token found. Please log in again.");
      console.error("Cannot submit - no token in localStorage");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      console.log("Starting form submission for product ID:", id);
      
      // Validate only required fields
      if (!formData.title || formData.title.trim() === "") {
        throw new Error("Product title is required");
      }
      if (!formData.price || formData.price === "") {
        throw new Error("Product price is required");
      }
      if (!formData.category || formData.category.trim() === "") {
        throw new Error("Product category is required");
      }

      console.log("Validation passed, preparing FormData");

      // Prepare FormData
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("category", formData.category);
      data.append("studentName", formData.studentName || "");
      data.append("studentContact", formData.studentContact || "");
      data.append("payoutMethod", formData.payoutMethod || "");
      data.append("privateNotes", formData.privateNotes || "");

      // Only append image if a new one was selected
      if (formData.image) {
        console.log("New image selected:", formData.image.name);
        data.append("image", formData.image);
      }

      console.log("Sending update request to backend...");
      console.log("Product ID:", id);
      console.log("FormData entries:");
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}:`, value instanceof File ? value.name : value);
      }
      
      // Send to Backend
      const response = await updateListing(id, data);
      console.log("Update response:", response);

      alert("Listing updated successfully!");
      // Tell the dashboard to refetch data after navigation
      navigate("/admin", { state: { refetch: Date.now() } });
    } catch (err) {
      console.error("Update Error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Full error object:", err);
      const serverMsg = err.response?.data?.message || err.message || "Unknown error occurred";
      setError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading product...</div>;
  }

  return (
    <div className="edit-listing" style={{ border: "2px solid blue", padding: "20px", borderRadius: "12px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Edit Listing</h2>

      {error && <div className="error-message" style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h5 style={{ marginBottom: "10px" }}>Product Title</h5>
          <input
            type="text"
            name="title"
            placeholder="e.g Calculus 2 Text book"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "80%", padding: "12px", borderRadius: "13px", marginBottom: "8px" }}
          />
        </div>

        <div style={{ display: "flex", marginBottom: "10px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <h5 style={{ marginBottom: "10px" }}>Price (Le)</h5>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              style={{ width: "30%", padding: "12px", borderRadius: "13px" }}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <h5 style={{ marginBottom: "10px" }}>Category</h5>
            <input
              type="text"
              name="category"
              placeholder="e.g. Books, Electronics"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: "60%", padding: "12px", borderRadius: "13px" }}
            />
          </div>
        </div>

        <div className="form-group">
          <h5 style={{ marginBottom: "10px" }}>Description</h5>
          <textarea
            name="description"
            placeholder="Describe the item condition..."
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: "80%", padding: "12px", borderRadius: "13px", height: "100px", marginBottom: "20px" }}
          />
        </div>

        <div className="form-group">
          <h5 style={{ marginBottom: "10px" }}>Product Image (Leave blank to keep current image)</h5>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px", borderRadius: "8px" }} />
            </div>
          )}
        </div>

        <div className="line-text" style={{ margin: "40px 0", textAlign: "center", borderBottom: "1px solid #ccc", lineHeight: "0.1em" }}>
          <span style={{ background: "#fff", padding: "0 10px", color: "#666" }}>INTERNAL ADMIN RECORDS</span>
        </div>

        <div className="form-group">
          <h4>Student Seller Name</h4>
          <input
            type="text"
            name="studentName"
            placeholder="Full Name"
            value={formData.studentName}
            onChange={handleChange}
            required
            style={{ padding: "15px", width: "80%", borderRadius: "12px", marginBottom: "15px" }}
          />
        </div>

        <div className="form-group">
          <h4>Contact info</h4>
          <input
            type="text"
            name="studentContact"
            placeholder="Email / Phone / WhatsApp"
            value={formData.studentContact}
            onChange={handleChange}
            required
            style={{ padding: "15px", width: "80%", borderRadius: "12px", marginBottom: "15px" }}
          />
        </div>

        <div className="form-group">
          <h4>Agreed Payout Method</h4>
          <input
            type="text"
            name="payoutMethod"
            placeholder="Bank / Orange Money / AfriMoney"
            value={formData.payoutMethod}
            onChange={handleChange}
            required
            style={{ padding: "15px", width: "80%", borderRadius: "12px", marginBottom: "15px" }}
          />
        </div>

        <div className="form-group">
          <h4>Private Notes</h4>
          <textarea
            name="privateNotes"
            placeholder="Internal notes about item verification or payout..."
            value={formData.privateNotes}
            onChange={handleChange}
            style={{ padding: "15px", width: "80%", height: "100px", borderRadius: "12px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            type="submit"
            disabled={submitting}
            onClick={(e) => {
              console.log("Update button clicked!");
              handleSubmit(e);
            }}
            style={{
              padding: "15px",
              width: "40%",
              borderRadius: "12px",
              marginTop: "2rem",
              backgroundColor: submitting ? "#ccc" : "#007bff",
              color: "white",
              cursor: "pointer",
              border: "none",
              fontSize: "1.1rem",
            }}
          >
            {submitting ? "Updating Listing..." : "Update Listing"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={{
              padding: "15px",
              width: "40%",
              borderRadius: "12px",
              marginTop: "2rem",
              backgroundColor: "#6c757d",
              color: "white",
              cursor: "pointer",
              border: "none",
              fontSize: "1.1rem",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}