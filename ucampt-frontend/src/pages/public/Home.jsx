import { useState, useEffect } from "react";
import ProductCard from "../../components/product/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>; // Display error if fetch fails

  return (
    <div className="home-page">
      <section className="hero" style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#1b40a8ff", fontWeight: "bolder", fontSize: "2rem" }}>Back To Campus</h2>
        <h1>Semester Essentials</h1>
        <h2>Everything you need for the new term, from books to.....</h2>
      </section>

      <section className="featured-products">
        <h1 style={{textAlign:"center", marginBottom:"2rem"}}>Fresh on campus</h1>
        <div
          className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="why-ucampt" style={{ marginTop: "40px" }}>
        <h2>Why Ucampt?</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✓ Verified listings from trusted administrators</li>
          <li>✓ Secure payment processing</li>
          <li>✓ Campus pickup or delivery available</li>
          <li>✓ Community-driven marketplace</li>
        </ul>
      </section>
    </div>
  );
}