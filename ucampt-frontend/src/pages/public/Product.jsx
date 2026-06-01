//
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../services/productService";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  // Categories will be derived from fetched products so filter buttons match actual product categories.

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        // normalize category names and attach a normalized property for filtering
        const normalizeCategory = (input) => {
          if (!input) return 'Uncategorized';
          const s = input.toString().trim().toLowerCase();
          const map = {
            'cloths': 'Clothing',
            'clothes': 'Clothing',
            'clothing': 'Clothing',
            'acc': 'Accessories',
            'accesories': 'Accessories',
            'accesory': 'Accessories',
            'accessories': 'Accessories',
            'electronic': 'Electronics',
            'electronics': 'Electronics',
            'furnitures': 'Furniture',
            'furniture': 'Furniture',
            'books': 'Books',
            'all': 'All'
          };
          if (map[s]) return map[s];
          // fallback: title-case each word
          return s.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        };

        const withNorm = response.data.map(p => ({ ...p, _normCategory: normalizeCategory(p.category) }));
        setProducts(withNorm);
        setFilteredProducts(withNorm);
        // derive categories from normalized categories (unique, keep order)
        const cats = Array.from(new Set(withNorm.map(p => p._normCategory || 'Uncategorized')));
        setCategories(["All", ...cats]);
      } catch (error) {
        console.error("Failed to load products:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      // filter by normalized category
      filtered = filtered.filter(p => (p._normCategory || 'Uncategorized') === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="product-page">
      <h1>Marketplace</h1>

      <div className="filters" style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "15px",  }}>
          <input
            type="text"
            placeholder="Search for textbooks, dorm supplies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "80%",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize:"1.0rem",
              fontWeight:"bolder"
            }}
          />
        </div>

        <div>
          <label>Category: </label>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                marginRight: "10px",
                padding: "8px 15px",
                backgroundColor: selectedCategory === cat ? "#007bff" : "#f0f0f0",
                color: selectedCategory === cat ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
