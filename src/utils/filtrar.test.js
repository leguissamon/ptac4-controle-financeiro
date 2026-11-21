import { describe, it, expect } from 'vitest';
import { filtrarLancamentos } from './filtrar.js';

const lista = [
  { _id: '1', tipo: 'receita', descricao: 'Salário' },
  { _id: '2', tipo: 'despesa', descricao: 'Mercado do mês' },
  { _id: '3', tipo: 'despesa', descricao: 'Cinema' },
  { _id: '4', tipo: 'despesa' },
];

describe('filtrarLancamentos', () => {
  it('devolve todos quando o termo está vazio', () => {
    expect(filtrarLancamentos(lista, '')).toEqual(lista);
    expect(filtrarLancamentos(lista, '   ')).toEqual(lista);
  });

  it('filtra pela descrição', () => {
    const resultado = filtrarLancamentos(lista, 'merc');
    expect(resultado).toHaveLength(1);
    expect(resultado[0]._id).toBe('2');
  });

  it('ignora maiúsculas e acentos', () => {
    expect(filtrarLancamentos(lista, 'SALARIO')[0]._id).toBe('1');
    expect(filtrarLancamentos(lista, 'mes')[0]._id).toBe('2');
  });

  it('devolve lista vazia quando nada combina', () => {
    expect(filtrarLancamentos(lista, 'xyz')).toEqual([]);
  });

  it('não quebra com lançamentos sem descrição', () => {
    expect(filtrarLancamentos(lista, 'a')).not.toContainEqual(lista[3]);
  });
});