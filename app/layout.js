import { Manrope } from "next/font/google";
import "./globals.css";

// Manrope (Google Fonts) em tudo — regra do design.md.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata = {
  title: "Meu CRM",
  description: "CRM para organizar contatos e oportunidades de negócio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
