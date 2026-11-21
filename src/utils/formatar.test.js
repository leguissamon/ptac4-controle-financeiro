import { describe, it, expect } from 'vitest';
import { formatarValor, formatarData, reaisParaCentavos, centavosParaReais } from './formatar.js';

describe('formatarValor', () => {
  it('formata centavos em reais com separador de milhar', () => {
    expect(formatarValor(150000)).toBe('R$ 1.500,00');
    expect(formatarValor(123456789)).toBe('R$ 1.234.567,89');
  });

  it('mantém os centavos', () => {
    expect(formatarValor(5)).toBe('R$ 0,05');
  });

  it('formata zero e valores vazios', () => {
    expect(formatarValor(0)).toBe('R$ 0,00');
    expect(formatarValor(undefined)).toBe('R$ 0,00');
  });

  it('formata valores negativos', () => {
    expect(formatarValor(-5000)).toBe('-R$ 50,00');
  });
});

describe('formatarData', () => {
  it('converte AAAA-MM-DD em DD/MM/AAAA', () => {
    expect(formatarData('2026-11-10')).toBe('10/11/2026');
  });

  it('devolve texto vazio para datas ausentes ou inválidas', () => {
    expect(formatarData('')).toBe('');
    expect(formatarData(undefined)).toBe('');
  });
});

describe('reaisParaCentavos', () => {
  it('converte o valor digitado em centavos', () => {
    expect(reaisParaCentavos('1500.50')).toBe(150050);
    expect(reaisParaCentavos('12,5')).toBe(1250);
  });

  it('não perde centavos por imprecisão de decimais', () => {
    expect(reaisParaCentavos('19.99')).toBe(1999);
  });

  it('devolve null para texto vazio ou inválido', () => {
    expect(reaisParaCentavos('')).toBeNull();
    expect(reaisParaCentavos('   ')).toBeNull();
    expect(reaisParaCentavos('abc')).toBeNull();
  });
});

describe('centavosParaReais', () => {
  it('converte centavos em texto com duas casas', () => {
    expect(centavosParaReais(150050)).toBe('1500.50');
    expect(centavosParaReais(5)).toBe('0.05');
  });
});