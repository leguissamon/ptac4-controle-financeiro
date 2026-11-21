// Tira acentos e maiúsculas: "Salário" -> "salario"
function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Devolve só os lançamentos cuja descrição contém o termo buscado.
export function filtrarLancamentos(lancamentos, termo) {
  const busca = normalizar(termo);

  if (busca === '') return lancamentos;

  return lancamentos.filter((l) => normalizar(l.descricao).includes(busca));
}