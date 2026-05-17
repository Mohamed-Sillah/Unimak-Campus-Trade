import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../services/productService";

export default function CreateListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState("");

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
        setLoading(true);
        setError("");

        try {
            // 1. Prepare FormData (This is required for sending files)
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("studentName", formData.studentName);
            data.append("studentContact", formData.studentContact);
            data.append("payoutMethod", formData.payoutMethod);
            data.append("privateNotes", formData.privateNotes);

            if (formData.image) {
                data.append("image", formData.image);
            }

            // 2. Send to Backend via Service
            // We no longer use manual fetch() here
            await createListing(data);

            alert("Listing created successfully!");
            navigate("/admin");
        } catch (err) {
            // Axios stores the server error message in err.response.data
            const serverMsg = err.response?.data?.message || err.message;
            setError("Server error: " + serverMsg);
            console.error("Upload Error:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-listing" style={{ border: "2px solid blue", padding: "20px", borderRadius: "12px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Create New Listing</h2>

            {error && <div className="error-message" style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group" >
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
                        <select name="category" value={formData.category} onChange={handleChange} required style={{ width: "60%", padding: "12px", borderRadius: "13px" }}>
                            <option value="">-- Select category --</option>
                            {(() => {
                                try {
                                    const s = localStorage.getItem('ucampt_categories');
                                    const arr = s ? JSON.parse(s) : ["Books", "Electronics", "Accessories", "Clothing", "Furniture"];
                                    return arr.map(c => <option key={c} value={c}>{c}</option>);
                                } catch (e) {
                                    return ["Books", "Electronics", "Accessories", "Clothing", "Furniture"].map(c => <option key={c} value={c}>{c}</option>);
                                }
                            })()}
                        </select>
                        <div style={{ marginTop: 8 }}>
                            <a href="/admin/categories" style={{ color: '#007bff' }}>Manage categories</a>
                        </div>
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
                    <h5 style={{ marginBottom: "10px" }}>Product Image</h5>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
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

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "15px",
                            width: "80%",
                            borderRadius: "12px",
                            marginTop: "2rem",
                            backgroundColor: loading ? "#ccc" : "#007bff",
                            color: "white",
                            cursor: "pointer",
                            border: "none",
                            fontSize: "1.1rem"
                        }}
                    >
                        {loading ? "Publishing Listing..." : "Publish Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}