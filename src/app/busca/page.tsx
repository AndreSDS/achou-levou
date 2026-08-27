"use client";

import { useState, useCallback } from "react";
import { ScoredItem, SearchFilters } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { Filters } from "@/components/Filters";
import { useRouter } from "next/navigation";

export default function BuscaPage() {
  const router = useRouter();
  const [items, setItems] = useState<ScoredItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({ query: "", order: "relevance" });

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set("q", filters.query);
      if (filters.category) params.set("category", filters.category);
      if (filters.minPrice) params.set("price_min", String(filters.minPrice));
      if (filters.maxPrice) params.set("price_max", String(filters.maxPrice));
      if (filters.order) params.set("order", filters.order);

      const res = await fetch(`/api/ml/search?${params.toString()}`);
      if (!res.ok) throw new Error("Erro na busca");
      const data = await res.json();
      setItems(data.results || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSelect = useCallback((item: ScoredItem) => {
    router.push(`/post?item=${encodeURIComponent(item.id)}`);
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Busca de produtos</h2>

      <Filters filters={filters} onChange={setFilters} />

      <div className="flex gap-3 mb-6">
        <button
          onClick={search}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {items.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-12">Nenhum produto encontrado. Tente outra busca.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}