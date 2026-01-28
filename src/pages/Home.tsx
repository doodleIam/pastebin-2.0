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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    checkConnection()
      .then(() => {
        setConnectionStatus("connected");
        setError("");
      })
      .catch(() => {
        setConnectionStatus("disconnected");
        setError("Backend not reachable");
      });

    const saved = JSON.parse(localStorage.getItem("pastes") || "[]");
    setHistory(saved);
  }, []);

  const validateInputs = (): string[] => {
    const errors: string[] = [];
    
    if (!content.trim()) {
      errors.push("Content is required");
    }
    
    if (content.length > 10000) {
      errors.push("Content exceeds 10,000 characters limit");
    }
    
    if (ttl && (Number(ttl) < 60 || Number(ttl) > 604800)) {
      errors.push("TTL must be between 60 seconds and 7 days (604800 seconds)");
    }
    
    if (maxViews && Number(maxViews) < 1) {
      errors.push("Max views must be at least 1");
    }
    
    if (maxViews && Number(maxViews) > 1000) {
      errors.push("Max views cannot exceed 1000");
    }
    
    return errors;
  };

  const handleCreatePaste = async (): Promise<void> => {
    const validationErrors = validateInputs();
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await createPaste({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      });

      setUrl(res.url);
      savePasteUrl(res.url);
      setHistory((prev) => [res.url, ...prev].slice(0, 10));
      
      // Clear form after successful creation
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create paste. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleCreatePaste();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("pastes");
    setHistory([]);
  };

  const characterCount = content.length;
  const isContentValid = characterCount <= 10000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">
              Pastebin Clone
            </h1>
            <p className="text-gray-600 mt-2">Share code and text securely</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === "connected" 
                ? "bg-green-100 text-green-800" 
                : connectionStatus === "disconnected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {connectionStatus === "connected" && "✓ Connected"}
              {connectionStatus === "disconnected" && "✗ Disconnected"}
              {connectionStatus === "checking" && "Checking..."}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Content Textarea */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={12}
              className={`w-full p-4 border-2 rounded-lg font-mono text-sm resize-y transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                !isContentValid ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Paste your content here... (Ctrl + Enter to submit)"
            />
            <div className="flex justify-between mt-2">
              <div className={`text-sm ${!isContentValid ? "text-red-600" : "text-gray-500"}`}>
                {characterCount} / 10,000 characters
              </div>
              <div className="text-sm text-gray-500">
                Hint: Use Ctrl + Enter to submit
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time to Live (TTL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  placeholder="Optional - seconds"
                  min="60"
                  max="604800"
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-3 text-gray-400">⏱️</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Between 60s and 7 days. Leave empty for no expiration.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Views
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Optional - number"
                  min="1"
                  max="1000"
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-3 text-gray-400">👁️</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Between 1 and 1000. Leave empty for unlimited views.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreatePaste}
            disabled={isSubmitting || !content.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              isSubmitting || !content.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Paste"
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <p className="text-red-700 font-medium flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Generated URL */}
          {url && (
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
              <p className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="mr-2">🔗</span>
                Shareable Link Created!
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 p-3 bg-white border border-green-300 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Copy Link
                </button>
              </div>
              <p className="text-green-600 text-sm mt-2">
                Link saved to browser history. It will expire based on your settings.
              </p>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📋</span>
                  Recent Pastes
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-800 px-3 py-1 hover:bg-red-50 rounded"
                >
                  Clear All
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {history.map((link, index) => (
                    <li 
                      key={link} 
                      className="flex items-center p-3 bg-white rounded border hover:bg-indigo-50 transition-colors"
                    >
                      <span className="text-gray-400 mr-3 text-sm">{index + 1}.</span>
                      <a 
                        href={link} 
                        className="flex-1 text-indigo-600 hover:text-indigo-800 hover:underline truncate font-mono text-sm"
                        target="_blank" 
                        rel="noreferrer"
                      >
                        {link}
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(link)}
                        className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500 text-sm mt-3">
                  History is stored locally in your browser
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
          <p>All pastes are encrypted and automatically deleted based on expiration settings.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;