import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext"; // adjust path to your actual file

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;