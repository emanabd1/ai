import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ChatbotWidget({ session }) {
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatboxRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;
    const msg = { role: "user", content: input };
    setMessages([...messages, msg]);
    setInput("");
    setStream("...");
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, msg] }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setMessages([...messages, msg, { role: "assistant", content: data.answer }]);
    setStream("");
  };

  useEffect(() => {
    chatboxRef.current?.scrollTo(0, 999999);
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button onClick={() => setOpen(!open)}
        className="bg-gradient-to-br from-indigo-500 to-blue-400 text-white p-4 rounded-full drop-shadow-2xl hover:scale-105 transition">
        <svg width={28} height={28} viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C6.489 3 2 6.807 2 11c0 1.793.773 3.474 2.121 4.797-.291 1.1-1.11 2.415-1.779 3.412-.225.34.043.791.442.791.349 0 1.32-.388 2.181-.711C6.402 19.577 8.137 20 10 20c5.511 0 10-3.807 10-9s-4.489-8-8-8z"/></svg>
      </button>
      {open && (
        <div className="w-96 bg-white rounded-xl shadow-2xl mt-2 px-4 py-6 flex flex-col">
          <div className="flex items-center mb-3">
            <span className="font-bold text-indigo-600 text-xl">AI Chat</span>
            <button className="ml-auto text-gray-400 hover:text-red-400" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div ref={chatboxRef} className="overflow-y-auto h-64 mb-2 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user"
                ? "self-end bg-indigo-100 text-neutral-700 px-3 py-2 rounded-lg"
                : "self-start bg-blue-100 text-neutral-700 px-3 py-2 rounded-lg"}>
                {m.content}
              </div>
            ))}
            {stream && <div className="text-gray-400 animate-pulse">{stream}</div>}
          </div>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 rounded-lg border focus:ring-2 focus:ring-indigo-400 px-3 py-2 transition" placeholder="Type your question..." />
            <button className="bg-indigo-500 rounded-lg px-4 py-2 text-white hover:bg-indigo-600 transition">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}