import { carregarEstado, salvarEstado } from './armazenamento.js';

let armazenamento;
try {
  armazenamento = window.localStorage;
} catch {
  armazenamento = null;
}

export const estado = carregarEstado(armazenamento).estado;

export function salvarDados() {
  salvarEstado(armazenamento, estado);
}

export function categoriasDoLote(lote) {
  const exemplos = [
    {
      material: 'notebook',
      quantidade: 1,
      pesoUnitarioGramas: 2400,
      pesoGramas: 2400,
      observacoes: 'Carcaça danificada',
    },
    {
      material: 'celular',
      quantidade: 1,
      pesoUnitarioGramas: 200,
      pesoGramas: 200,
      observacoes: '',
    },
    {
      material: 'cabos',
      quantidade: 3,
      pesoUnitarioGramas: 200,
      pesoGramas: 600,
      observacoes: '',
    },
  ];
  const salvo = estado.rascunhosTriagem[lote.id] || [];
  const categorias = exemplos.map(
    (categoria) => salvo.find((item) => item.material === categoria.material) || categoria,
  );

  estado.rascunhosTriagem[lote.id] = categorias;
  return categorias;
}
