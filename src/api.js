// Endereço único da API. Se a porta ou o prefixo mudarem, só esta linha muda.
const BASE_URL = 'http://localhost:3000/api/v1';

// Mensagens para quando a API não explica o erro.
const MENSAGENS_POR_STATUS = {
  400: 'Dados inválidos. Confira o que foi preenchido.',
  404: 'Item não encontrado.',
  409: 'Esta ação não é possível porque há dados relacionados.',
  422: 'A regra de negócio não permite esta operação.',
  500: 'Erro no servidor. Tente novamente em instantes.',
};

// Só desembrulha quando "data" é uma lista (o envelope { data, meta }).
// Um lançamento tem um campo "data" que é texto, e não pode ser confundido com envelope.
function desembrulhar(resposta) {
  if (resposta && typeof resposta === 'object' && Array.isArray(resposta.data)) {
    return resposta.data;
  }
  return resposta;
}

async function request(caminho, { method = 'GET', body, signal } = {}) {
  const opcoes = { method, signal, headers: {} };

  if (body !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${caminho}`, opcoes);
  } catch (erro) {
    // O AbortError precisa passar intacto: quem chamou decide ignorá-lo.
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Não foi possível conectar à API. Confira se o servidor está rodando.');
  }

  // DELETE costuma responder 204, sem corpo.
  if (response.status === 204) return null;

  let corpo = null;
  try {
    corpo = await response.json();
  } catch {
    corpo = null;
  }

  if (!response.ok) {
    const mensagem =
      corpo?.message ||
      MENSAGENS_POR_STATUS[response.status] ||
      `Erro ${response.status} ao falar com a API.`;
    throw new Error(mensagem);
  }

  return desembrulhar(corpo);
}

export const apiGet = (caminho, signal) => request(caminho, { signal });
export const apiPost = (caminho, body) => request(caminho, { method: 'POST', body });
export const apiPut = (caminho, body) => request(caminho, { method: 'PUT', body });
export const apiDelete = (caminho) => request(caminho, { method: 'DELETE' });