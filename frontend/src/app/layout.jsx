import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gerenciador de Produtos | Next.js + Express (Sessão)",
  description:
    "Sistema CRUD de produtos integrado com Node.js, Express, Next.js e Bootstrap salvo em sessão sem banco de dados e sem CORS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-light min-vh-100 d-flex flex-column">{children}</body>
    </html>
  );
}
