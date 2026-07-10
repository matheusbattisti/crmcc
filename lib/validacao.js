// Valida telefone no formato brasileiro.
// Aceita fixo (10 dígitos) ou celular (11 dígitos), sempre com DDD.
// O campo é opcional: vazio conta como válido (não obriga telefone).
export function telefoneValido(telefone) {
  const bruto = (telefone || "").trim();
  if (bruto === "") return true; // opcional

  const digitos = bruto.replace(/\D/g, ""); // só os números

  // Fixo tem 10 dígitos, celular tem 11. Qualquer outra quantidade é inválida.
  if (digitos.length !== 10 && digitos.length !== 11) return false;

  // DDD não começa com zero.
  if (digitos[0] === "0") return false;

  // Celular (11 dígitos) precisa do 9 logo depois do DDD.
  if (digitos.length === 11 && digitos[2] !== "9") return false;

  return true;
}
