"use client";

import { useState, useCallback } from "react";
import { PostData } from "@/types";
import { getHistory, deletePost } from "@/lib/storage";

export default function HistoricoPage() {
  const [history, setHistory] = useState<PostData[]>(() => getHistory());

  const handleDelete = useCallback((id: string) => {
    deletePost(id);
    setHistory(getHistory());
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de posts</h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Nenhum post gerado ainda.</p>
      ) : (
        <div className="space-y-4">
          {history.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase">{post.category.name}</span>
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(post.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3 mt-2">
                {post.body}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}