import { criarEstadoInicial } from './dados.js';

export const chave = 'e-coleta-pacote3-v1';

export function carregarEstado(storage) {
  try {
    const texto = storage.getItem(chave);
    if (!texto) {
      return {
        estado: criarEstadoInicial(),
        aviso: '',
      };
    }
    const salvo = JSON.parse(texto);
    if (
      salvo.versao !== 1 ||
      !Array.isArray(salvo.coletas) ||
      !Array.isArray(salvo.lotes) ||
      !salvo.busca ||
      !Array.isArray(salvo.busca.materiais) ||
      !salvo.preferencias ||
      !salvo.rascunhosColeta ||
      !salvo.rascunhosTriagem
    ) {
      throw new Error('Formato inválido.');
    }
    return {
      estado: salvo,
      aviso: '',
    };
  } catch {
    return {
      estado: criarEstadoInicial(),
      aviso: 'Não foi possível recuperar os dados salvos. Os exemplos iniciais foram carregados.',
    };
  }
}

export function salvarEstado(storage, estado) {
  try {
    storage.setItem(chave, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}
