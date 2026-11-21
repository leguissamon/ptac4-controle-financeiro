import CartaoLancamento from './CartaoLancamento.jsx';

// Procura o nome de uma conta ou categoria pelo _id
const nomeDe = (lista, id) => lista.find((item) => item._id === id)?.nome ?? 'Sem nome';

export default function ListaLancamentos({
  lancamentos,
  total,
  busca,
  contas,
  categorias,
  carregando,
  erro,
  onTentarNovamente,
}) {
  if (carregando) {
    return (
      <p className="estado" role="status">
        Carregando lançamentos…
      </p>
    );
  }

  if (erro) {
    return (
      <div className="estado estado--erro" role="alert">
        <p>{erro}</p>
        <button type="button" onClick={onTentarNovamente}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (total === 0) {
    return <p className="estado">Nenhum lançamento cadastrado para este usuário.</p>;
  }

  if (lancamentos.length === 0) {
    return <p className="estado">Nenhum lançamento encontrado para “{busca}”.</p>;
  }

  return (
    <ul className="lista">
      {lancamentos.map((l) => (
        <li key={l._id}>
          <CartaoLancamento
            lancamento={l}
            nomeConta={nomeDe(contas, l.contaId)}
            nomeCategoria={nomeDe(categorias, l.categoriaId)}
          />
        </li>
      ))}
    </ul>
  );
}