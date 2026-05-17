import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
    const user = JSON.parse(localStorage.getItem("user")); // your auth logic here

    if (!user) {
        // Not logged in → go to login page
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Role mismatch → go to a safe page
        return <Navigate to="/" replace />;
    }

    // User is authorized
    return children;
};

export default ProtectedRoute;