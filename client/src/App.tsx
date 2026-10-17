import MeetingRoom from "./pages/MeetingRoom";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./store/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8">Loading...</p>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const loadUser = useAuth((s) => s.loadUser);
  useEffect(() => { loadUser(); }, [loadUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/meeting/:roomCode" element={<Protected><MeetingRoom /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}