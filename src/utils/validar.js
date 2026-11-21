// Confere os dados do formulário. Se algo estiver errado, lança um erro com mensagem amigável.
// Se estiver tudo certo, devolve os dados prontos para enviar à API.
// "valor" chega já em centavos (inteiro) ou null, se o campo estava vazio/inválido.
export function validarLancamento(dados) {
  const { contaId, categoriaId, tipo, valor, data, descricao } = dados ?? {};

  if (!contaId) throw new Error('Escolha a conta.');
  if (!categoriaId) throw new Error('Escolha a categoria.');
  if (tipo !== 'receita' && tipo !== 'despesa') throw new Error('Escolha se é receita ou despesa.');
  if (!Number.isInteger(valor) || valor <= 0) throw new Error('Informe um valor maior que zero.');
  if (!data) throw new Error('Informe a data.');

  return {
    contaId,
    categoriaId,
    tipo,
    valor,
    data,
    descricao: String(descricao ?? '').trim(),
  };
}