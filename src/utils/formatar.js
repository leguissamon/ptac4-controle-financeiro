// Centavos -> "R$ 1.500,00"
export function formatarValor(centavos) {
  const valor = Number(centavos) || 0;
  const sinal = valor < 0 ? '-' : '';
  const [inteiro, decimal] = (Math.abs(valor) / 100).toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${sinal}R$ ${comMilhar},${decimal}`;
}

// "2026-11-10" -> "10/11/2026"
export function formatarData(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(iso)) {
    return '';
  }

  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// O que a pessoa digitou ("1500.50" ou "12,5") -> centavos (150050). Texto inválido -> null.
export function reaisParaCentavos(valor) {
  const texto = String(valor ?? '').trim().replace(',', '.');

  if (texto === '') return null;

  const numero = Number(texto);
  if (!Number.isFinite(numero)) return null;

  return Math.round(numero * 100);
}

// Centavos -> texto para o campo de edição ("1500.50")
export function centavosParaReais(centavos) {
  return ((Number(centavos) || 0) / 100).toFixed(2);
}