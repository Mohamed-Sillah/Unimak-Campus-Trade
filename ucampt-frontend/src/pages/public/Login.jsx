// login page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Enforce .edu email for admin access (client-side check). Backend should also validate.
    if (!email.toLowerCase().endsWith('.edu')) {
      setError('Admin login requires a .edu university email');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Store user in context and localStorage
      login(user);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: "400px", margin: "50px auto", display:"flex",
      flexDirection:"column", justifyContent:"center",alignItems:"center"
     }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <img src="src/assets/images/authenticationlogo.jpg" width="100px" height="100px"
            alt="" />
        </div>
      <h1 style={{textAlign:"center", marginBottom:"0"}}>Admin Portal</h1>
      <span style={{display:"flex", justifyContent:"center", textAlign:"center"}}>
          <p style={{color: "#b1b0b0ff", width:"35ch"}}>Secure access for verified organization administrators to manage inventory and orders.</p>
      </span>
      

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <div style={{border:"1px ", minWidth:"500px", borderRadius:"12px"}}>
          <form onSubmit={handleSubmit} style={{padding:"50px",backgroundColor:"#FFFFFF",boxShadow:"0 4px 10px rgba(0, 0, 0, 0.5)",borderRadius:"8px"}}>
        <div style={{ marginBottom: "15px" }}>
            <h3 style={{fontWeight:"bolder"}}>University Email</h3>
          <input
            type="email"
            placeholder= "admin@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "90%", padding: "20px", borderRadius:"10px",fontSize:"0.9rem", fontWeight:"bold" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
            <h3 style={{fontWeight:"bolder"}}>Password</h3>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "90%", padding: "20px", borderRadius:"10px", fontSize:"0.9rem", fontWeight:"bold"}}
          />
          <a href="/forgot-password" style={{ display: "flex",justifyContent:"end", marginTop: "8px",
            marginLeft:"17rem", textAlign: "right", color: "#007bff", textDecoration: "none", fontSize: "0.8rem", fontWeight:"bolder" }}>
            Forgot Password?
          </a>
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
          <button type="submit" disabled={loading} style={{ width: "90%", padding:"20px", borderRadius:"10px"}}>
            {loading ? "Logging in..." : "Login to Dashboard "}
          </button>
        </div>
      </form>
      </div>
      

      <p style={{ marginTop: "45px", textAlign: "center", color: "#cfcfcfff", fontWeight:"bold"}}>
        Not an Adminsitrator ?
      </p>

      <a href="/products" style={{ marginTop: "20px",width:"250px",textAlign: "center", color: "#333",fontWeight:"bold", border:"1px ",backgroundColor:"#FFFFFF",boxShadow:"0 4px 10px rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",gap:"0.6rem",
         padding:"15px", textDecoration:"none", borderRadius:"50px" }}> <img src="src/assets/images/marketplaceicon.jpg" width="22px" alt="" /> Return to Marketplace</a>
      <p style={{ marginTop: "35px",fontWeight:"bold", textAlign: "center", color: "#cfcfcfff", display:"flex", gap:"0.5rem" }}> <img src="src/assets/images/secureicon.jpg" width="20px" alt="" />SECURE CONNECTION</p>
      <p style={{ marginTop: "20px", textAlign: "center", color: "#dddbdbff" }}>Ucampt Admin Acess v2.40</p>
    </div>
  );
}