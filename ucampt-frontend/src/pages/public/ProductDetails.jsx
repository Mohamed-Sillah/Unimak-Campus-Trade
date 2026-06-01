import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!product) return <div>Product not found</div>;

  const handleCopyContact = async () => {
    try {
      const contactText = `${product.studentName || ''} ${product.studentContact || ''}`.trim();
      if (navigator.clipboard && contactText) {
        await navigator.clipboard.writeText(contactText);
        alert('Seller contact copied to clipboard');
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="product-details">
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Images */}
        <div>
          {product.image && (
            <>
              {(() => {
                const imageSrc = product.image.startsWith('http')
                  ? product.image
                  : `http://localhost:5000${product.image.startsWith('/') ? '' : '/'}${product.image}`;
                return (
                  <img src={imageSrc} alt={product.title} style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }} />
                );
              })()}
            </>
          )}
          {!product.image && (
            <div style={{
              width: "100%",
              height: "400px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px"
            }}>
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1>{product.title}</h1>
          
          <div style={{ marginBottom: "20px" }}>
            <p><strong>Price:</strong> Le {product.price != null ? Number(product.price).toLocaleString() : 'N/A'}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Posted:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>

          <h3>Description</h3>
          <p>{product.description || 'No description provided.'}</p>

          <h3>Seller Information</h3>
          <div style={{ marginBottom: "20px" }}>
            <p><strong>Name:</strong> {product.studentName}</p>
            <p><strong>Contact:</strong> {product.studentContact}</p>
            <p><strong>Payout Method:</strong> {product.payoutMethod}</p>
            {product.privateNotes && (
              <p><strong>Notes:</strong> {product.privateNotes}</p>
            )}
          </div>

          <div style={{ marginTop: "30px" }}>
            <h3>Contact Seller</h3>
            <p style={{ marginBottom: "10px" }}>Use one of the options below to contact the seller off-platform.</p>

            {/* Phone / WhatsApp */}
            {product.studentContact && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <a
                  href={`tel:${product.studentContact}`}
                  style={{ padding: '10px 12px', background: '#0d6efd', color: 'white', borderRadius: '8px', textDecoration: 'none' }}
                >
                  Call
                </a>

                {/* WhatsApp quick link (opens in new tab) */}
                <a
                  href={`https://wa.me/${(product.studentContact || '').replace(/[^0-9+]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '10px 12px', background: '#25D366', color: 'white', borderRadius: '8px', textDecoration: 'none' }}
                >
                  WhatsApp
                </a>

                <button onClick={handleCopyContact} style={{ padding: '10px 12px', borderRadius: '8px' }}>
                  Copy Contact
                </button>
              </div>
            )}

            {/* Email if provided */}
            {product.studentContact && product.studentContact.includes('@') && (
              <a href={`mailto:${product.studentContact}`} style={{ display: 'inline-block', padding: '8px 12px', background: '#6c757d', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>Email Seller</a>
            )}

            {/* Notes for admins: payoutMethod/privateNotes are for admin reference only */}
          </div>
        </div>
      </div>
    </div>
  );
}
