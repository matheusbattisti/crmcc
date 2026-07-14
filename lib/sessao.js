// Sessão assinada (HMAC) usando Web Crypto — funciona no Edge (middleware) e no Node (rotas).
// O cookie guarda "dados.assinatura"; sem o segredo, ninguém forja uma sessão válida.
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesParaBase64url(bytes) {
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlParaBytes(texto) {
  const base64 = texto.replace(/-/g, "+").replace(/_/g, "/");
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

async function obterChave() {
  const segredo = process.env.SESSION_TOKEN;
  // Sem o segredo configurado, é melhor falhar do que assinar sessões forjáveis.
  if (!segredo) {
    throw new Error("Falta SESSION_TOKEN no arquivo de segredos (.env.local).");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function criarSessao(dados) {
  const payload = bytesParaBase64url(encoder.encode(JSON.stringify(dados)));
  const chave = await obterChave();
  const assinatura = await crypto.subtle.sign("HMAC", chave, encoder.encode(payload));
  return `${payload}.${bytesParaBase64url(new Uint8Array(assinatura))}`;
}

export async function lerSessao(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, assinatura] = token.split(".");
  try {
    const chave = await obterChave();
    const valida = await crypto.subtle.verify(
      "HMAC",
      chave,
      base64urlParaBytes(assinatura),
      encoder.encode(payload)
    );
    if (!valida) return null;
    return JSON.parse(decoder.decode(base64urlParaBytes(payload)));
  } catch {
    return null;
  }
}
