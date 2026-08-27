"use client";

import { useState } from "react";

export function PostPreview({ body }: { body: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Preview do post</h3>
        <button
          onClick={handleCopy}
          className={`px-4 py-1.5 rounded text-sm font-medium transition ${
            copied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-auto">
        {body}
      </pre>
    </div>
  );
}