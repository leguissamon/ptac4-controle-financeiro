import { useEffect, useState } from 'react';
import { apiGet } from './api.js';
import { filtrarLancamentos } from './utils/filtrar.js';
import Cabecalho from './components/Cabecalho.jsx';
import Busca from './components/Busca.jsx';
import FormLancamento from './components/FormLancamento.jsx';
import ListaLancamentos from './components/ListaLancamentos.jsx';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [lancamentos, setLancamentos] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  // 1) Ao abrir a página: carrega os usuários e escolhe o primeiro.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarUsuarios() {
      try {
        const lista = await apiGet('/usuarios', controller.signal);
        setUsuarios(lista);

        if (lista.length > 0) {
          setUsuarioId((atual) => atual || lista[0]._id);
        } else {
          setCarregando(false);
        }
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(e.message);
        setCarregando(false);
      }
    }

    carregarUsuarios();
    return () => controller.abort();
  }, [tentativa]);

  // 2) Sempre que o usuário muda: carrega lançamentos, contas e categorias dele.
  useEffect(() => {
    if (!usuarioId) return;

    const controller = new AbortController();

    async function carregarDados() {
      setCarregando(true);
      setErro('');

      try {
        const [listaLancamentos, listaContas, listaCategorias] = await Promise.all([
          apiGet(`/lancamentos?usuarioId=${usuarioId}`, controller.signal),
          apiGet(`/contas?usuarioId=${usuarioId}`, controller.signal),
          apiGet(`/categorias?usuarioId=${usuarioId}`, controller.signal),
        ]);

        setLancamentos(listaLancamentos);
        setContas(listaContas);
        setCategorias(listaCategorias);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(e.message);
      } finally {
        // Se esta requisição foi cancelada, a nova já cuida do estado de carregamento.
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregarDados();
    return () => controller.abort();
  }, [usuarioId, tentativa]);

  // Chamado pelo formulário quando a API criou o lançamento.
  // O novo vai para o começo da lista, sem refazer o GET (RF02).
  function adicionarLancamento(novo) {
    setLancamentos((atual) => [novo, ...atual]);
  }

  const visiveis = filtrarLancamentos(lancamentos, busca);
  const semUsuarios = !carregando && !erro && usuarios.length === 0;

  return (
    <>
      <Cabecalho usuarios={usuarios} usuarioId={usuarioId} onMudarUsuario={setUsuarioId} />

      <main>
        {semUsuarios ? (
          <p className="estado">
            Nenhum usuário cadastrado. Crie um pela API (POST /api/v1/usuarios) e recarregue a página.
          </p>
        ) : (
          <>
            {usuarioId && !carregando && !erro && (
              <FormLancamento
                key={usuarioId}
                usuarioId={usuarioId}
                contas={contas}
                categorias={categorias}
                onCriado={adicionarLancamento}
              />
            )}
            <Busca valor={busca} onChange={setBusca} />
            <ListaLancamentos
              lancamentos={visiveis}
              total={lancamentos.length}
              busca={busca}
              contas={contas}
              categorias={categorias}
              carregando={carregando}
              erro={erro}
              onTentarNovamente={() => setTentativa((n) => n + 1)}
            />
          </>
        )}
      </main>
    </>
  );
}