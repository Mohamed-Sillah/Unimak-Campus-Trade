import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "ucampt_categories";
const DEFAULT_CATEGORIES = ["Books", "Electronics", "Accessories", "Clothing", "Furniture"];

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setCategories(JSON.parse(stored));
        else setCategories(DEFAULT_CATEGORIES);
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }, [categories]);

    const addCategory = (e) => {
        e.preventDefault();
        const trimmed = newCat.trim();
        if (!trimmed) return;
        if (categories.includes(trimmed)) {
            alert("Category already exists");
            return;
        }
        setCategories(prev => [...prev, trimmed]);
        setNewCat("");
    };

    const removeCategory = (cat) => {
        if (!confirm(`Delete category "${cat}"?`)) return;
        setCategories(prev => prev.filter(c => c !== cat));
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
            <h2>Category Management</h2>
            <p style={{ color: "#666" }}>
                Categories are stored locally for now. Use these categories when creating listings.
            </p>

            <form onSubmit={addCategory} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" />
                <button type="submit">Add</button>
            </form>

            <div style={{ display: "grid", gap: 8 }}>
                {categories.map(cat => (
                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #eee", padding: 10, borderRadius: 8 }}>
                        <div>{cat}</div>
                        <div>
                            <button onClick={() => removeCategory(cat)} style={{ marginRight: 8 }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 20 }}>
                <Link to="/admin" style={{ textDecoration: "none", color: "#007bff" }}>← Back to Dashboard</Link>
            </div>
        </div>
    );
}