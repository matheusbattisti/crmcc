"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ usuario, role }) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="topbar">
      <div className="nav-esquerda">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-name">Meu CRM</span>
        </div>
        <nav className="nav-links">
          <Link
            className={"nav-link" + (pathname === "/" ? " nav-link--ativo" : "")}
            href="/"
          >
            Contatos
          </Link>
          {role === "admin" ? (
            <Link
              className={
                "nav-link" + (pathname === "/usuarios" ? " nav-link--ativo" : "")
              }
              href="/usuarios"
            >
              Usuários
            </Link>
          ) : null}
        </nav>
      </div>

      <div className="nav-direita">
        {usuario ? <span className="nav-usuario">{usuario}</span> : null}
        <button type="button" className="botao-texto" onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}
