import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
    return (

        <div style={{ backgroundColor: "#F7F9FC", minHeight: "100vh" }}>
            <span style={{
                display: "flex", justifyContent: "space-between",
                padding: "15px", paddingTop: "2px", alignItems: "center", height: "80px", marginBottom: "2rem",
                backgroundColor: "#FFFFFF", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)"
            }}>
                <span>
                    <h5 style={{ color: "blue" }}>ADMIN PORTAL </h5>
                    <h3>Dashboard</h3>
                </span>
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <AdminSidebar />
                    <a href="/" style={{ textDecoration: "none" }}>Home</a>
                </span>
            </span>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>

                <main style={{ marginLeft: "20px" }}>
                    <Outlet />
                </main>
            </div>

        </div>
    );
}