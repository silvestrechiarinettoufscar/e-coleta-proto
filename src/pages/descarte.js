import '../main.js';
import { pontos } from '../dados.js';
import { estado, salvarDados } from '../estado.js';
import { buscarPontos, formatarDistancia } from '../regras.js';
import { listarMateriais } from '../interface.js';

const pagina = document.body.dataset.pagina;

if (pagina === 'descarte-materiais') {
  prepararBusca();
} else if (pagina === 'descarte-pontos') {
  atualizarResultados();
} else {
  atualizarPonto();
}

function prepararBusca() {
  const formulario = document.querySelector('#busca');
  const campoLocalizacao = formulario.elements.localizacao;
  campoLocalizacao.value = estado.busca.localizacao || 'São Carlos · perto do campus';
  // A busca manual usa o cenário de exemplo do Figma, sem interpretar endereços.
  estado.busca.regiao = 'campus';

  formulario.querySelectorAll('[name="materiais"]').forEach((campo) => {
    campo.checked = estado.busca.materiais.includes(campo.value);
  });

  formulario.addEventListener('input', (event) => {
    const selecionados = formulario.querySelectorAll('[name="materiais"]:checked');
    estado.busca.materiais = [...selecionados].map((campo) => campo.value);

    if (event.target === campoLocalizacao) {
      estado.busca.localizacao = campoLocalizacao.value;
      estado.busca.regiao = 'campus';
      estado.busca.coordenadas = null;
    }

    salvarDados();
    document.querySelector('#erro-materiais').hidden = true;
  });

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!estado.busca.materiais.length) {
      const erro = document.querySelector('#erro-materiais');
      erro.textContent = 'Selecione pelo menos um material.';
      erro.hidden = false;
      return;
    }
    salvarDados();
    location.href = 'pontos.html';
  });
}

function atualizarResultados() {
  const encontrados = buscarPontos(pontos, estado.busca);
  const lista = document.querySelector('#pontos');
  const verPonto = document.querySelector('#ver-ponto');
  document.querySelector('#quantidade-pontos').textContent = encontrados.length;
  document.querySelector('#sem-resultados').hidden = encontrados.length > 0;
  verPonto.hidden = encontrados.length === 0;

  lista.querySelectorAll('[data-ponto]').forEach((cartao) => {
    cartao.hidden = true;
  });

  encontrados.forEach((ponto) => {
    const cartao = lista.querySelector(`[data-ponto="${ponto.id}"]`);
    cartao.hidden = false;
    cartao.querySelector('[data-distancia]').textContent = formatarDistancia(ponto.distancia);
    lista.append(cartao);
  });

  const primeiroPonto = encontrados[0];
  if (primeiroPonto) {
    verPonto.textContent = `Ver ${primeiroPonto.nome}`;
    verPonto.href = `detalhes.html?id=${primeiroPonto.id}`;
  }
}

function atualizarPonto() {
  const id = new URLSearchParams(location.search).get('id') || 'campus';
  const ponto = pontos.find((ponto) => ponto.id === id);
  if (!ponto) {
    location.replace('pontos.html');
    return;
  }

  const encontrados = buscarPontos(pontos, estado.busca);
  const resultado = encontrados.find((resultado) => resultado.id === ponto.id);
  const distancia = resultado?.distancia ?? ponto.distancias.campus;
  document.querySelector('#endereco').textContent = ponto.endereco;
  document.querySelector('#distancia').textContent = formatarDistancia(distancia);

  if (pagina === 'descarte-detalhes') {
    document.querySelector('h1').textContent = ponto.nome;
    document.title = `${ponto.nome} · E-Coleta`;
    document.querySelector('#horario').textContent = ponto.horario;
    const itens = ponto.materiais.map((material) => ({ material }));
    document.querySelector('#materiais-aceitos').textContent = listarMateriais(itens);
    document.querySelector('#ver-rota').href = `rota.html?id=${ponto.id}`;
  } else {
    document.querySelector('#nome-ponto').textContent = ponto.nome;
    document.querySelector('#minutos').textContent = Math.max(1, Math.round(distancia / 72));
  }
}
