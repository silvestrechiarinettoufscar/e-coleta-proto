import '../main.js';
import { materiais } from '../dados.js';
import { estado, salvarDados, categoriasDoLote } from '../estado.js';
import { formatarPeso, somarPesos, validarCategoria } from '../regras.js';
import { nomeMaterial, listarMateriais, mostrarErros } from '../interface.js';

const pagina = document.body.dataset.pagina;
const id = new URLSearchParams(location.search).get('id') || 'EC-024';
const lote = estado.lotes.find((lote) => lote.id === id);

if (pagina === 'triagem-lotes') {
  atualizarLotes();
} else if (!lote || lote.situacao === 'em-transporte') {
  location.replace('index.html');
} else if (lote.situacao === 'concluido' && pagina !== 'triagem-concluida') {
  location.replace(`concluida.html?id=${lote.id}`);
} else {
  prepararPagina();
}

function atualizarLotes() {
  document.querySelectorAll('[data-lote]').forEach((cartao) => {
    const lote = estado.lotes.find((lote) => lote.id === cartao.dataset.lote);
    if (!lote || lote.situacao === 'em-transporte') {
      cartao.hidden = true;
      return;
    }
    const pendente = lote.situacao === 'pendente';
    cartao.querySelector('[data-pendente]').hidden = !pendente;
    cartao.querySelector('[data-situacao]').textContent = pendente
      ? 'aguardando triagem'
      : 'entrada registrada';
  });
}

function prepararPagina() {
  document.querySelector('#lote-id').textContent = lote.id;

  switch (pagina) {
    case 'triagem-conferencia':
      document.querySelector('#recebido-em').textContent = lote.recebidoEm;
      document.querySelector('#motorista').textContent = lote.motorista;
      document.querySelector('#faixa').textContent = lote.faixa.toLowerCase();
      document.querySelector('#itens').textContent = listarMateriais(lote.previstos).toLowerCase();
      document.querySelector('#iniciar-triagem').href = `formulario.html?id=${lote.id}`;
      break;
    case 'triagem-formulario':
      prepararFormulario();
      break;
    case 'triagem-revisao':
      prepararRevisao();
      break;
    case 'triagem-concluida':
      mostrarConclusao();
      break;
  }
}

function prepararFormulario() {
  const categorias = categoriasDoLote(lote);
  const formulario = document.querySelector('#categoria');
  const campos = formulario.elements;
  let materialAtual = 'notebook';

  function preencherFormulario() {
    const categoria = categorias.find((categoria) => categoria.material === materialAtual);
    campos.quantidade.value = categoria.quantidade;
    const unitario =
      categoria.pesoUnitarioGramas ??
      (categoria.quantidade ? Math.round(categoria.pesoGramas / categoria.quantidade) : 0);
    campos.peso.value = String(unitario / 1000).replace('.', ',');
    campos.observacoes.value = categoria.observacoes;
  }

  function salvarCategoria() {
    const resultado = validarCategoria(
      {
        material: materialAtual,
        quantidade: campos.quantidade.value,
        peso: campos.peso.value,
        observacoes: campos.observacoes.value,
      },
      materiais.map((material) => material.id),
    );

    if (mostrarErros(formulario, resultado.erros)) {
      return false;
    }

    const indice = categorias.findIndex((categoria) => categoria.material === materialAtual);
    categorias[indice] = resultado.categoria;
    salvarDados();
    return true;
  }

  preencherFormulario();

  campos.material.addEventListener('change', () => {
    const proximo = campos.material.value;
    if (!salvarCategoria()) {
      campos.material.value = materialAtual;
      return;
    }
    materialAtual = proximo;
    preencherFormulario();
  });

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    if (salvarCategoria()) {
      location.href = `revisao.html?id=${lote.id}`;
    }
  });
}

function prepararRevisao() {
  const categorias = categoriasDoLote(lote);
  const lista = document.querySelector('#materiais-aferidos');
  const itens = categorias.map((categoria) => {
    const paragrafo = document.createElement('p');
    const nome = nomeMaterial(categoria.material);
    if (!categoria.quantidade) {
      paragrafo.textContent = `${nome} · nenhum item`;
    } else if (categoria.quantidade === 1) {
      paragrafo.textContent = `${nome} · 1 un. · ${formatarPeso(categoria.pesoGramas)}`;
    } else {
      paragrafo.textContent = `${nome} · ${categoria.quantidade} un. × ${formatarPeso(categoria.pesoUnitarioGramas ?? Math.round(categoria.pesoGramas / categoria.quantidade))} · ${formatarPeso(categoria.pesoGramas)}`;
    }
    return paragrafo;
  });

  lista.replaceChildren(...itens);
  document.querySelector('#quantidade-categorias').textContent = categorias.length;
  document.querySelector('#peso-total').textContent = formatarPeso(somarPesos(categorias));
  document.querySelector('#editar-categorias').href = `formulario.html?id=${lote.id}`;

  document.querySelector('#finalizar').addEventListener('click', () => {
    lote.categorias = structuredClone(categorias);
    lote.situacao = 'concluido';
    lote.concluidoEm = new Date().toISOString();
    salvarDados();
    location.href = `concluida.html?id=${lote.id}`;
  });
}

function mostrarConclusao() {
  if (lote.situacao !== 'concluido') {
    location.replace(`conferencia.html?id=${lote.id}`);
    return;
  }
  document.querySelector('#quantidade-categorias').textContent = lote.categorias.length;
  const comItens = lote.categorias.filter((categoria) => categoria.quantidade > 0);
  document.querySelector('#itens').textContent = comItens.length
    ? listarMateriais(comItens)
    : 'Nenhum item registrado';
}
