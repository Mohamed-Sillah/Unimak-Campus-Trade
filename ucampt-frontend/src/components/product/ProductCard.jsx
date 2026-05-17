import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div style={{display:"flex",justifyContent:"space-around", flexWrap:"wrap", width:"300px"}}>
        <div className="product-card" style={{display:"flex", flexDirection:"column", justifyContent:"center",
     alignItems:"center", width:"200px", borderRadius:"12px"}}>
      {product.image && (
        <img
          className="product-image"
          src={
            product.image.startsWith('http')
              ? product.image
              : `http://localhost:5000${product.image.startsWith('/') ? '' : '/'}${product.image}`
          }
          alt={product.title}
          onError={(e) => {
            console.error("Image failed to load:", product.image);
            e.target.src = "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      )}
      <span style={{display:"flex", flexDirection:"column", gap:"0rem"}}>
          <h3 style={{marginTop:"0.4rem", color:"#5618c9ff", fontWeight:"bold"}}>{product.title}</h3>
        {product.description && (
          <p style={{marginTop:"0", fontWeight:"bold"}} className="description">{product.description.substring(0, 100)}...</p>
      )}
        <p style={{marginTop:"0", fontWeight:"bold"}} className="price">Le {product.price != null ? Number(product.price).toLocaleString() : 'N/A'}</p>

        <Link to={`/products/${product.id}`} style={{textDecoration:"none", fontWeight:"bold"}}>
          View Details
        </Link>
      </span>
    </div>
    </div>
  );
}