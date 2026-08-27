import Link from "next/link";

export function RoutineTimeline() {
  const slots = [
    { time: "09h", label: "🔥 Achado do Dia", href: "/post?template=1" },
    { time: "12h", label: "💰 Produto barato", href: "/post?template=3" },
    { time: "15h", label: "📱 Tecnologia / Casa", href: "/post?template=4" },
    { time: "19h", label: "🚨 Oferta forte", href: "/post?template=2" },
    { time: "21h", label: "⭐ Top 3 achados", href: "/busca" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Rotina do dia</h2>
      <div className="space-y-3">
        {slots.map((slot) => (
          <Link
            key={slot.time}
            href={slot.href}
            className="flex items-center justify-between p-3 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <span className="text-sm font-medium text-gray-600">{slot.time}</span>
            <span className="text-sm font-semibold text-gray-900">{slot.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}