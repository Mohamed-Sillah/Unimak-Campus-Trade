import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "Password reset link sent to your email");
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img src="src/assets/images/authenticationlogo.jpg" width="100px" height="100px"
          alt="" />
      </div>
      <h1 style={{textAlign:"center", marginBottom:"0"}}>Reset Password</h1>
      <span style={{display:"flex", justifyContent:"center", textAlign:"center"}}>
        <p style={{color: "#666", width:"35ch"}}>Enter your email address and we'll send you a link to reset your password.</p>
      </span>

      {error && <div style={{ color: "red", marginBottom: "10px", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "5px" }}>{error}</div>}
      
      {message && <div style={{ color: "green", marginBottom: "10px", padding: "10px", backgroundColor: "#e0ffe0", borderRadius: "5px" }}>{message}</div>}

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{fontWeight:"bolder"}}>University Email</h3>
            <input
              type="email"
              placeholder="admin@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "20px", borderRadius:"10px", fontSize:"0.9rem", fontWeight:"bold" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
            <button type="submit" disabled={loading} style={{ width: "90%", padding:"20px", borderRadius:"10px", marginLeft:"30px"}}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#333", marginBottom: "20px" }}>Check your email for the password reset link. The link will expire in 1 hour.</p>
          <button onClick={() => navigate("/login")} style={{ padding:"20px", borderRadius:"10px", width: "90%", marginLeft:"30px", cursor: "pointer" }}>
            Back to Login
          </button>
        </div>
      )}

      <p style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
        Remember your password?
      </p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <a href="/login" style={{ textAlign: "center", color: "#007bff", textDecoration: "none" }}>Back to Login</a>
      </div>

      <p style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>SECURE CONNECTION</p>
      <p style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>Ucampt Admin Access</p>
    </div>
  );
}