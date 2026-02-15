import { useSession, signIn, signOut } from "next-auth/react";
import ChatbotWidget from "../components/ChatbotWidget";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-200 flex flex-col items-center">
      <nav className="w-full flex justify-between items-center py-4 px-8 bg-white bg-opacity-70 shadow">
        <span className="text-2xl font-bold text-indigo-700">SmartLanding.AI</span>
        <div>
          {session ? (
            <button onClick={() => signOut()} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">Logout</button>
          ) : (
            <button onClick={() => signIn()} className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition">Login / Sign Up</button>
          )}
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-8 pt-20">
        <h1 className="text-5xl font-extrabold text-neutral-800 leading-tight text-center">
          Engage visitors with <span className="text-indigo-600">AI Answers</span>
          <span className="text-lg text-neutral-500 mt-2 block">Instant support, document chat, and smart onboarding</span>
        </h1>
        <div className="mt-10 w-full flex justify-center">
          {session ? (
            <a href="/admin" className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 text-lg font-semibold transition">Go to Admin</a>
          ) : (
            <button onClick={() => signIn()} className="bg-indigo-500 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-600 text-lg font-semibold transition">Try the Demo</button>
          )}
        </div>
        <ChatbotWidget session={session} />
      </main>
    </div>
  );
}