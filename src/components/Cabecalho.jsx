export default function Cabecalho({ usuarios, usuarioId, onMudarUsuario }) {
  return (
    <header className="cabecalho">
      <h1>Controle financeiro</h1>
      <label className="cabecalho__usuario">
        <span>Usuário</span>
        <select
          value={usuarioId}
          onChange={(e) => onMudarUsuario(e.target.value)}
          disabled={usuarios.length === 0}
        >
          {usuarios.map((u) => (
            <option key={u._id} value={u._id}>
              {u.nome}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}