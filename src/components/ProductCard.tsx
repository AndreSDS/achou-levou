import Image from "next/image";
import { ScoredItem } from "@/types";

export function ProductCard({ item, onSelect }: { item: ScoredItem; onSelect: (item: ScoredItem) => void }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-contain p-2"
        />
        {item.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(item.discount * 100)}%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price)}
            </span>
            {item.original_price && item.original_price > item.price && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.original_price)}
              </span>
            )}
          </div>
          {item.sold_quantity && (
            <p className="text-xs text-gray-500 mb-2">{item.sold_quantity} vendidos</p>
          )}
          <button
            onClick={() => onSelect(item)}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 transition"
          >
            Usar no post
          </button>
        </div>
      </div>
    </div>
  );
}