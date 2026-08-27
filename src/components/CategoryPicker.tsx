"use client";

import { Category } from "@/types";
import { categories } from "@/lib/categories";

export function CategoryPicker({ selected, onSelect }: { selected: Category | null; onSelect: (c: Category) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
            selected?.id === cat.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}