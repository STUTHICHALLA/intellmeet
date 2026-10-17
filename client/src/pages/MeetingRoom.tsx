import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../store/auth";

interface Msg {
  name: string;
  text: string;
  at: number;
}

export default function MeetingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [typingName, setTypingName] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("accessToken"), name: user?.name },
    });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("join-room", roomCode));
    socket.on("chat", (m: Msg) => setMessages((prev) => [...prev, m]));
    socket.on("system", (s: string) => setNotices((prev) => [...prev, s]));
    socket.on("typing", (name: string) => {
      setTypingName(name);
      setTimeout(() => setTypingName(""), 1500);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, user?.name]);

  const send = () => {
    if (!text.trim()) return;
    socketRef.current?.emit("chat", { roomCode, text });
    setText("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meeting room</h1>
            <p className="text-slate-400">Room code: {roomCode}</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-700 rounded px-4 py-2 hover:bg-slate-600"
          >
            Leave
          </button>
        </div>

        <div className="mt-6 bg-slate-800 rounded-xl p-4 h-80 overflow-y-auto space-y-2">
          {notices.slice(-3).map((n, i) => (
            <p key={i} className="text-xs text-slate-500 text-center">{n}</p>
          ))}
          {messages.map((m, i) => (
            <p key={i}>
              <span className="font-semibold text-indigo-300">{m.name}: </span>
              {m.text}
            </p>
          ))}
        </div>

        <p className="h-5 text-sm text-slate-400">
          {typingName && `${typingName} is typing...`}
        </p>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded p-2 bg-white text-slate-900"
            placeholder="Type a message"
            aria-label="Chat message"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              socketRef.current?.emit("typing", roomCode);
            }}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} className="bg-indigo-600 rounded px-4 hover:bg-indigo-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}