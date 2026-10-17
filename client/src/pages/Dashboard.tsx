import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

interface Meeting {
  _id: string;
  title: string;
  roomCode: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/meetings");
      setMeetings(data.meetings);
    } catch {
      setError("Could not load meetings");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!title.trim()) return;
    try {
      const { data } = await api.post("/meetings", { title });
      setTitle("");
      navigate(`/meeting/${data.meeting.roomCode}`);
    } catch {
      setError("Could not create meeting");
    }
  };

  const join = async () => {
    const roomCode = code.trim();
    if (!roomCode) return;
    try {
      await api.get(`/meetings/${roomCode}`);
      navigate(`/meeting/${roomCode}`);
    } catch {
      setError("Meeting not found");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">IntellMeet</h1>
            <p className="text-slate-300">
              Signed in as {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="bg-slate-700 rounded px-4 py-2 hover:bg-slate-600"
          >
            Log out
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="bg-slate-800 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold">New meeting</h2>
            <input
              className="w-full rounded p-2 bg-white text-slate-900"
              placeholder="Meeting title"
              aria-label="Meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={create}
              className="w-full bg-indigo-600 rounded p-2 hover:bg-indigo-700"
            >
              Create and start
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold">Join with a code</h2>
            <input
              className="w-full rounded p-2 text-slate-900"
              className="w-full rounded p-2 bg-white text-slate-900"
              aria-label="Room code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={join}
              className="w-full bg-indigo-600 rounded p-2 hover:bg-indigo-700"
            >
              Join
            </button>
          </div>
        </div>

        <h2 className="mt-8 text-xl font-semibold">Your meetings</h2>
        <ul className="mt-3 space-y-2">
          {meetings.length === 0 && (
            <li className="text-slate-400">No meetings yet. Create one above.</li>
          )}
          {meetings.map((m) => (
            <li
              key={m._id}
              className="bg-slate-800 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-slate-400">
                  Code: {m.roomCode} · {m.status}
                </p>
              </div>
              <button
                onClick={() => navigate(`/meeting/${m.roomCode}`)}
                className="bg-indigo-600 rounded px-3 py-1 hover:bg-indigo-700"
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}