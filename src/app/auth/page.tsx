"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";

interface AuthStatus {
  connected: boolean;
  user_id?: string;
  scope?: string;
  expires_in?: number;
  obtained_at?: number;
}

export default function AuthPage({ searchParams }: { searchParams: Promise<{ status?: string; reason?: string }> }) {
  const params = use(searchParams);
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadStatus() {
      try {
        const res = await fetch("/api/ml/auth/status");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setAuthStatus(data);
        } else if (mounted) {
          setAuthStatus(null);
        }
      } catch {
        if (mounted) setAuthStatus(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const handleConnect = useCallback(() => {
    setActionLoading(true);
    router.push("/api/ml/auth/login");
  }, [router]);

  const handleRevoke = useCallback(async () => {
    setRevoking(true);
    try {
      const res = await fetch("/api/ml/auth/revoke", { method: "POST" });
      if (res.ok) {
        setAuthStatus(null);
      }
    } catch (error) {
      console.error("ML revoke error:", error);
    } finally {
      setRevoking(false);
      setActionLoading(false);
    }
  }, []);

  const statusMessage = params.status === "success"
    ? { type: "success" as const, text: "Conexão realizada com sucesso!" }
    : params.status === "error"
      ? { type: "error" as const, text: `Erro na autenticação: ${params.reason || "desconhecido"}` }
      : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Autenticação Mercado Livre</h1>
            <p className="text-sm text-gray-600">
              Conecte sua conta para gerar links de afiliado automaticamente.
            </p>
          </div>

          {statusMessage && (
            <div className={`mb-6 p-3 rounded text-sm text-center ${statusMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {statusMessage.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : authStatus?.connected ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Conta conectada</h2>
              {authStatus.user_id && (
                <p className="text-sm text-gray-600 mb-2">Usuário: {authStatus.user_id}</p>
              )}
              {authStatus.expires_in !== undefined && (
                <p className="text-sm text-gray-500 mb-6">
                  Token expira em {Math.floor(authStatus.expires_in / 60)} minutos
                </p>
              )}
              <button
                onClick={handleRevoke}
                disabled={revoking || actionLoading}
                className="w-full bg-red-600 text-white font-medium py-2.5 px-6 rounded hover:bg-red-700 disabled:opacity-50 transition"
              >
                {revoking ? "Desconectando..." : "Desconectar conta"}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma conta conectada</h2>
              <p className="text-sm text-gray-500 mb-6">
                Conecte sua conta Mercado Livre para usar tokens OAuth automáticos na geração de links de afiliado.
              </p>
              <button
                onClick={handleConnect}
                disabled={actionLoading}
                className="w-full bg-green-600 text-white font-medium py-2.5 px-6 rounded hover:bg-green-700 disabled:opacity-50 transition"
              >
                {actionLoading ? "Redirecionando..." : "Conectar conta Mercado Livre"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/config")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Voltar para configurações
          </button>
        </div>
      </div>
    </div>
  );
}
