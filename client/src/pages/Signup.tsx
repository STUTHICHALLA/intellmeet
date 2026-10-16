import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    if (await signup(name, email, password)) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <input
          className="w-full border rounded p-2"
          placeholder="Name"
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          placeholder="Password (8+ characters)"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submit} className="w-full bg-indigo-600 text-white rounded p-2 hover:bg-indigo-700">
          Sign up
        </button>
        <p className="text-sm text-slate-600">
          Have an account? <Link to="/login" className="text-indigo-600">Log in</Link>
        </p>
      </div>
    </div>
  );
}