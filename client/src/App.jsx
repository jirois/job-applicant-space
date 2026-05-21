import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import { useAuth } from "./context/AuthContext";

// Wrapper that redirects unauthenticated users to login
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/post"
        element={
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
