import { NextResponse } from "next/server";
import { lerSessao } from "./lib/sessao";

// Porteiro: roda antes de qualquer rota. Sem sessão válida, nada passa.
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("crm_sessao")?.value;
  const sessao = token ? await lerSessao(token) : null;
  const autenticado = Boolean(sessao);

  // Rotas públicas de autenticação (login, cadastro e suas APIs).
  const ehAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/api/register");

  if (ehAuth) {
    // Já logado tentando ver login/cadastro? Manda pro CRM.
    if (autenticado && (pathname === "/login" || pathname === "/register")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (autenticado) {
    return NextResponse.next();
  }

  // Não autenticado: dados respondem 401; páginas vão para o login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
