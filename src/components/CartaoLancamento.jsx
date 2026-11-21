import { formatarValor, formatarData } from '../utils/formatar.js';

// Mostra um lançamento. Recebe tudo por props e não chama a API.
export default function CartaoLancamento({ lancamento, nomeConta, nomeCategoria }) {
  const { tipo, valor, data, descricao } = lancamento;
  const sinal = tipo === 'receita' ? '+' : '-';

  return (
    <article className={`cartao cartao--${tipo}`}>
      <div className="cartao__topo">
        <h3 className="cartao__titulo">{descricao || nomeCategoria}</h3>
        <strong className={`cartao__valor cartao__valor--${tipo}`}>
          {sinal} {formatarValor(valor)}
        </strong>
      </div>
      <p className="cartao__detalhes">
        {formatarData(data)} · {nomeCategoria} · {nomeConta}
      </p>
    </article>
  );
}