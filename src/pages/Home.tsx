import { useEffect, useState } from "react";
import { checkConnection, createPaste } from "../features/service";
import { savePasteUrl } from "../utils/helper";

function Home() {
  const [content, setContent] = useState<string>("");
  const [ttl, setTtl] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    checkConnection().catch(() => {
      setError("Backend not reachable");
    });

    const saved = JSON.parse(localStorage.getItem("pastes") || "[]");
    setHistory(saved);
  }, []);

  const handleCreatePaste = async (): Promise<void> => {
    try {
      const res = await createPaste({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      });

      setUrl(res.url);
      savePasteUrl(res.url);
      setHistory((prev) => [res.url, ...prev].slice(0, 10));
      setError("");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          Pastebin Clone
        </h1>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full mt-6 p-4 border rounded-lg"
        />

        <div className="flex gap-4 mt-4">
          <input
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            placeholder="TTL seconds (optional)"
            className="flex-1 p-3 border rounded-lg"
          />
          <input
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="Max views (optional)"
            className="flex-1 p-3 border rounded-lg"
          />
        </div>

        <button
          onClick={handleCreatePaste}
          className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg"
        >
          Create Paste
        </button>

        {error && (
          <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        {url && (
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
            <p className="font-semibold text-indigo-700">Shareable Link:</p>
            <a href={url} className="hover:underline hover:text-blue-600" target="_blank" rel="noreferrer">
              {url}
            </a>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
            <p className="font-semibold text-indigo-700">Recent Pastes:</p>
            <ul className="list-disc pl-5">
              {history.map((link) => (
                <li key={link}>
                  <a href={link} className="hover:underline hover:text-blue-600" target="_blank" rel="noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
