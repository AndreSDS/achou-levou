"use client";

import { useState, useCallback, useMemo } from "react";
import { use } from "react";
import Image from "next/image";
import { Category, PostTemplate, PostData, ScoredItem } from "@/types";
import { CategoryPicker } from "@/components/CategoryPicker";
import { TemplatePicker } from "@/components/TemplatePicker";
import { PostPreview } from "@/components/PostPreview";
import { buildPost } from "@/lib/postBuilder";
import { getTemplateById } from "@/lib/templates";
import { savePost } from "@/lib/storage";

export default function PostPage({ searchParams }: { searchParams: Promise<{ item?: string; template?: string }> }) {
  const params = use(searchParams);
  const [product, setProduct] = useState<ScoredItem | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [template, setTemplate] = useState<PostTemplate | null>(null);
  const [post, setPost] = useState<PostData | null>(null);
  const [affiliateUrl, setAffiliateUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const affiliateId: string = (() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("radar-achados-config");
    if (stored) {
      try {
        return JSON.parse(stored).mlAffiliateId || "";
      } catch {
        return "";
      }
    }
    return "";
  })();
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ml/search?q=${encodeURIComponent(itemId)}`);
      if (!res.ok) throw new Error("Produto não encontrado");
      const data = await res.json();
      const found = data.results?.[0];
      if (found) {
        setProduct(found);
        setCategory(found.suggestedCategory);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }, []);

  const templateFromParams = useMemo(() => {
    if (params.template) {
      return getTemplateById(Number(params.template)) || null;
    }
    return null;
  }, [params.template]);

  if (templateFromParams) {
    setTemplate(templateFromParams);
  }

  if (params.item && !product && !loading) {
    loadProduct(params.item);
  }

  const generatePost = useCallback(async () => {
    if (!product || !template) return;

    setLoading(true);
    setError(null);
    try {
      let finalUrl = affiliateUrl;

      if (!finalUrl && affiliateId) {
        const res = await fetch("/api/ml/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: product.id, affiliateId }),
        });
        if (res.ok) {
          const data = await res.json();
          finalUrl = data.url;
        }
      }

      if (!finalUrl) {
        setError("Informe o link de afiliado ou configure o ID de afiliado.");
        setLoading(false);
        return;
      }

      setAffiliateUrl(finalUrl);
      const built = buildPost(product, template, finalUrl);
      setPost(built);
      savePost(built);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar post");
    } finally {
      setLoading(false);
    }
  }, [product, template, affiliateId, affiliateUrl]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerar post</h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">1. Produto</h3>
            {product ? (
              <div className="flex gap-4">
                <Image src={product.thumbnail} alt={product.title} width={96} height={96} className="object-contain bg-gray-50 rounded" />
                <div>
                  <p className="font-medium text-gray-900">{product.title}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                  </p>
                  {product.sold_quantity && (
                    <p className="text-sm text-gray-500">{product.sold_quantity} vendidos</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum produto selecionado. <a href="/busca" className="text-blue-600 underline">Buscar produtos</a></p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">2. Categoria</h3>
            <CategoryPicker selected={category} onSelect={setCategory} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">3. Modelo</h3>
            <TemplatePicker selected={template} onSelect={setTemplate} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">4. Link de afiliado</h3>
            <input
              type="text"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="Cole aqui o link de afiliado ou configure em Config"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generatePost}
              disabled={!product || !template || loading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Gerando..." : "Gerar post"}
            </button>
          </div>
        </div>

        <div>
          {post && (
            <PostPreview body={post.body} />
          )}
        </div>
      </div>
    </div>
  );
}