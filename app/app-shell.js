"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Áreas do sistema — novas áreas entram nesta lista.
const AREAS = [
  { href: "/", rotulo: "Dashboard" },
  { href: "/funil", rotulo: "Funil" },
  { href: "/contatos", rotulo: "Contatos" },
  { href: "/usuarios", rotulo: "Usuários", soAdmin: true },
];

export default function AppShell({ usuario, role, larga, children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const areas = AREAS.filter((area) => !area.soAdmin || role === "admin");

  return (
    <div className="shell">
      <header className="shell-topo">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-name">Meu CRM</span>
        </div>

        <div className="nav-direita">
          {usuario ? <span className="nav-usuario">{usuario}</span> : null}
          <button type="button" className="botao-texto" onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      <div className="shell-corpo">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {areas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className={
                  "nav-item" + (pathname === area.href ? " nav-item--ativo" : "")
                }
              >
                {area.rotulo}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="conteudo">
          <div className={"app" + (larga ? " app--larga" : "")}>{children}</div>
        </main>
      </div>
    </div>
  );
}
