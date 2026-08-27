import Link from "next/link";
import { RoutineTimeline } from "@/components/RoutineTimeline";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Bem-vindo ao Radar de Achados. Use os atalhos abaixo para começar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Ações rápidas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/busca" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                <span className="text-2xl mb-2">🔍</span>
                <span className="text-sm font-medium text-gray-900">Buscar</span>
              </Link>
              <Link href="/post" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                <span className="text-2xl mb-2">✍️</span>
                <span className="text-sm font-medium text-gray-900">Criar post</span>
              </Link>
              <Link href="/historico" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                <span className="text-2xl mb-2">📋</span>
                <span className="text-sm font-medium text-gray-900">Histórico</span>
              </Link>
              <Link href="/config" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition">
                <span className="text-2xl mb-2">⚙️</span>
                <span className="text-sm font-medium text-gray-900">Config</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Como funciona</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Vá em <strong>Busca</strong> para encontrar produtos do Mercado Livre.</li>
              <li>Ranqueie os resultados por desconto, preço e vendas.</li>
              <li>Vá em <strong>Post</strong>, escolha um produto e gere o texto formatado.</li>
              <li>Copie e cole no seu Canal do WhatsApp.</li>
            </ol>
          </div>
        </div>

        <div>
          <RoutineTimeline />
        </div>
      </div>
    </div>
  );
}