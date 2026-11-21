// Campo controlado: o texto digitado fica guardado no App.
export default function Busca({ valor, onChange }) {
  return (
    <label className="busca">
      <span>Buscar lançamento</span>
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite parte da descrição"
      />
    </label>
  );
}