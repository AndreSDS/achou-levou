"use client";

import { PostTemplate } from "@/types";
import { templates } from "@/lib/templates";

export function TemplatePicker({ selected, onSelect }: { selected: PostTemplate | null; onSelect: (t: PostTemplate) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className={`text-left p-3 rounded-lg border transition ${
            selected?.id === t.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-400"
          }`}
        >
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.category}</span>
          <p className="text-sm font-medium text-gray-900 mt-1">{t.name}</p>
        </button>
      ))}
    </div>
  );
}