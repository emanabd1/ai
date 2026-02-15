import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ChatsPage() {
  const {data: session} = useSession();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    fetch("/api/chats").then(r=>r.json()).then(setChats);
  },[]);
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h1 className="text-2xl mb-4">My Chat History</h1>
      <ul>
        {chats.map(chat => (
          <li key={chat.id} className="bg-gray-50 rounded-lg mb-4 py-3 px-4">
            <div className="flex gap-2 mb-2">
              {chat.messages.map((msg, idx) => (
                <span key={idx} className={`text-sm ${msg.role==="user" ? "text-indigo-600" : "text-gray-600"}`}>{msg.content}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}