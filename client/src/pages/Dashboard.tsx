import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold">IntellMeet</h1>
      <p className="mt-2 text-slate-300">
        Signed in as {user?.name} ({user?.role})
      </p>
      <button
        onClick={async () => { await logout(); navigate("/login"); }}
        className="mt-6 bg-indigo-600 rounded px-4 py-2 hover:bg-indigo-700"
      >
        Log out
      </button>
    </div>
  );
}