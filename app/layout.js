import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Manrope em tudo; JetBrains Mono em números e etiquetas técnicas — regra do design.md.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["Consolas", "monospace"],
});

export const metadata = {
  title: "Meu CRM",
  description: "CRM para organizar contatos e oportunidades de negócio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.className} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
