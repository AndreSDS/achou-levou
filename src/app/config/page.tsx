"use client";

import { useState, useCallback } from "react";
import { AppConfig } from "@/types";
import { getConfig, saveConfig } from "@/lib/storage";

export default function ConfigPage() {
  const [config, setConfig] = useState<AppConfig>(() => getConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [config]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mercado Livre - Afiliado</h3>
        <p className="text-sm text-gray-600 mb-4">
          Informe seu ID de afiliado para gerar links rastreáveis. O token de acesso é configurado no servidor via <code>.env.local</code>.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">ML Affiliate ID</label>
        <input
          type="text"
          value={config.mlAffiliateId}
          onChange={(e) => setConfig({ ...config, mlAffiliateId: e.target.value })}
          placeholder="Ex: 123456789"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white font-medium py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Salvar
        </button>

        {saved && <p className="text-green-600 text-sm mt-2">Salvo com sucesso!</p>}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Variáveis de ambiente (servidor)</h3>
        <p className="text-sm text-gray-600 mb-2">
          As credenciais abaixo devem ser configuradas no arquivo <code>.env.local</code> na raiz do projeto.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li><code>ML_APP_ID</code></li>
          <li><code>ML_SECRET</code></li>
          <li><code>ML_ACCESS_TOKEN</code></li>
        </ul>
      </div>
    </div>
  );
}