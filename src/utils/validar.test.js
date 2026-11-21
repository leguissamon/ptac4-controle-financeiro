import { describe, it, expect } from 'vitest';
import { validarLancamento } from './validar.js';

const valido = {
  contaId: 'c1',
  categoriaId: 'k1',
  tipo: 'despesa',
  valor: 1000,
  data: '2026-11-10',
  descricao: '  Mercado  ',
};

describe('validarLancamento', () => {
  it('devolve os dados prontos para enviar, sem espaços sobrando na descrição', () => {
    expect(validarLancamento(valido)).toEqual({ ...valido, descricao: 'Mercado' });
  });

  it('aceita descrição vazia', () => {
    expect(validarLancamento({ ...valido, descricao: undefined }).descricao).toBe('');
  });

  it('lança erro quando falta a conta', () => {
    expect(() => validarLancamento({ ...valido, contaId: '' })).toThrow('Escolha a conta.');
  });

  it('lança erro quando falta a categoria', () => {
    expect(() => validarLancamento({ ...valido, categoriaId: '' })).toThrow('Escolha a categoria.');
  });

  it('lança erro quando o tipo é inválido', () => {
    expect(() => validarLancamento({ ...valido, tipo: 'outro' })).toThrow(
      'Escolha se é receita ou despesa.'
    );
  });

  it('lança erro quando o valor é zero, negativo ou vazio', () => {
    expect(() => validarLancamento({ ...valido, valor: 0 })).toThrow('Informe um valor maior que zero.');
    expect(() => validarLancamento({ ...valido, valor: -5 })).toThrow('Informe um valor maior que zero.');
    expect(() => validarLancamento({ ...valido, valor: null })).toThrow('Informe um valor maior que zero.');
  });

  it('lança erro quando falta a data', () => {
    expect(() => validarLancamento({ ...valido, data: '' })).toThrow('Informe a data.');
  });
});