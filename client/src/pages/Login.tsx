import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    if (await login(email, password)) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submit} className="w-full bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700">
          Log in
        </button>
        <p className="text-sm text-slate-600">
          No account? <Link to="/signup" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}