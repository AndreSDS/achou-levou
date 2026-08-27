import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radar de Achados",
  description: "Descubra produtos do Mercado Livre, ranqueie os melhores achados e gere posts prontos para o WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Radar de Achados</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/busca" className="text-gray-600 hover:text-gray-900">Busca</Link>
              <Link href="/post" className="text-gray-600 hover:text-gray-900">Post</Link>
              <Link href="/historico" className="text-gray-600 hover:text-gray-900">Histórico</Link>
              <Link href="/config" className="text-gray-600 hover:text-gray-900">Config</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}