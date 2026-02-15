import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  useEffect(() => { if (!session) router.push('/auth/signin'); }, [session]);
  useEffect(() => {
    // Fetch user's uploaded files
    fetch('/api/documents').then(r => r.json()).then(setFiles);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base Manager</h1>
      <form className="flex flex-col mb-6" method="POST" action="/api/upload" encType="multipart/form-data">
        <label className="mb-2 font-semibold">Upload PDF/Text</label>
        <input name="document" type="file" accept=".pdf,.txt" className="mb-4" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Upload</button>
      </form>
      <div>
        <h2 className="font-semibold mb-2">Uploaded Documents</h2>
        <ul>
          {files.map((f, i) => (
            <li key={i} className="mb-2 bg-gray-100 p-3 rounded flex items-center">
              <a href={f.fileUrl} className="mr-2 text-indigo-500 underline">{f.title}</a>
              <span className="text-sm text-gray-500 ml-auto">{new Date(f.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}