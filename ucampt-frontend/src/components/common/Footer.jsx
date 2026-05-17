export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer" style={{ 
      backgroundColor: "#f5f5f5", 
      padding: "20px", 
      textAlign: "center",
      marginTop: "40px",
      borderTop: "1px solid #ddd"
    }}>
      <p>&copy; {year} Unimak Campus Trade (Ucampt). All rights reserved.</p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Contact: <a href="mailto:ucampt@unimak.ac.sc">ucampt@unimak.ac.sc</a>
      </p>
    </footer>
  );
}