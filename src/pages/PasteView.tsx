import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaste } from "../features/service";

function PasteView() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getPaste(id)
      .then((data) => {
        setContent(data.content);
      })
      .catch(() => {
        setError("Paste not found or expired");
      });
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-indigo-700">Paste</h1>
        <pre className="mt-4 bg-gray-50 p-4 rounded-lg border">
          {content}
        </pre>
      </div>
    </div>
  );
}

export default PasteView;
