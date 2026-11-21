import { useState } from 'react';
import { apiPost } from '../api.js';
import { reaisParaCentavos } from '../utils/formatar.js';
import { validarLancamento } from '../utils/validar.js';

// Data de hoje no fuso local (toISOString usaria UTC e viraria o dia à noite).
const hoje = () => new Date().toLocaleDateString('sv-SE');

const vazio = () => ({
  tipo: 'despesa',
  valor: '',
  contaId: '',
  categoriaId: '',
  data: hoje(),
  descricao: '',
});

export default function FormLancamento({ usuarioId, contas, categorias, onCriado }) {
  const [campos, setCampos] = useState(vazio);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Cria um onChange para cada campo, sem repetir código
  const mudar = (nome) => (e) => {
    setCampos((atual) => ({ ...atual, [nome]: e.target.value }));
    setSucesso('');
  };

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // 1) Valida no front. Se falhar, a API nem é chamada (RF06).
    let dados;
    try {
      dados = validarLancamento({
        ...campos,
        valor: reaisParaCentavos(campos.valor),
      });
    } catch (e2) {
      setErro(e2.message);
      return;
    }

    // 2) Envia pelo helper (RF02 e RF07)
    setEnviando(true);
    try {
      const criado = await apiPost('/lancamentos', { usuarioId, ...dados });
      onCriado(criado); // o App coloca na lista, sem GET
      setCampos(vazio()); // limpa o formulário
      setSucesso('Lançamento cadastrado.');
    } catch (e2) {
      setErro(e2.message); // mensagem da API (ex.: 422)
    } finally {
      setEnviando(false);
    }
  }

  const semBase = contas.length === 0 || categorias.length === 0;

  if (semBase) {
    return (
      <p className="estado">
        Para cadastrar lançamentos, este usuário precisa de pelo menos uma conta e uma categoria
        (crie pelo Postman).
      </p>
    );
  }

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <h2 className="form__titulo">Novo lançamento</h2>

      <div className="form__linha">
        <label>
          <span>Tipo</span>
          <select value={campos.tipo} onChange={mudar('tipo')}>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </label>

        <label>
          <span>Valor (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={campos.valor}
            onChange={mudar('valor')}
          />
        </label>

        <label>
          <span>Data</span>
          <input type="date" value={campos.data} onChange={mudar('data')} />
        </label>
      </div>

      <div className="form__linha">
        <label>
          <span>Conta</span>
          <select value={campos.contaId} onChange={mudar('contaId')}>
            <option value="">Escolha…</option>
            {contas.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Categoria</span>
          <select value={campos.categoriaId} onChange={mudar('categoriaId')}>
            <option value="">Escolha…</option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>Descrição (opcional)</span>
        <input
          type="text"
          placeholder="Ex.: Mercado da semana"
          value={campos.descricao}
          onChange={mudar('descricao')}
        />
      </label>

      {erro && (
        <p className="form__erro" role="alert">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="form__sucesso" role="status">
          {sucesso}
        </p>
      )}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Salvando…' : 'Cadastrar'}
      </button>
    </form>
  );
}