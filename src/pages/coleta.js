import '../main.js';
import { estado, salvarDados } from '../estado.js';
import { listarMateriais, formatarHora, mostrarAviso } from '../interface.js';

const pagina = document.body.dataset.pagina;
const id = new URLSearchParams(location.search).get('id') || 'C-001';
const coleta = estado.coletas.find((coleta) => coleta.id === id);

if (pagina === 'coleta-itinerario') {
  atualizarItinerario();
} else if (!coleta) {
  location.replace('index.html');
} else if (coleta.situacao === 'concluida' && coleta.registro && pagina !== 'coleta-concluida') {
  location.replace(`concluida.html?id=${coleta.id}`);
} else {
  prepararPagina();
}

function atualizarItinerario() {
  document.querySelectorAll('[data-coleta]').forEach((cartao) => {
    const coleta = estado.coletas.find((coleta) => coleta.id === cartao.dataset.coleta);
    const concluida = coleta?.situacao === 'concluida';
    cartao.querySelector('[data-concluida]').hidden = !concluida;
    if (concluida) {
      cartao.href = `concluida.html?id=${coleta.id}`;
    }
  });

  const primeiraColeta = estado.coletas[0];
  if (primeiraColeta?.situacao === 'concluida') {
    const abrirColeta = document.querySelector('#abrir-coleta');
    abrirColeta.textContent = 'Ver registro da coleta';
    abrirColeta.href = `concluida.html?id=${primeiraColeta.id}`;
  }
}

function prepararPagina() {
  switch (pagina) {
    case 'coleta-agendamento':
      prepararAgendamento();
      break;
    case 'coleta-rota':
      document.querySelector('#endereco').textContent = coleta.endereco;
      document.querySelector('#gps').dataset.acao = `gps:${coleta.id}`;
      document.querySelector('#registrar').href = `registro.html?id=${coleta.id}`;
      break;
    case 'coleta-registro':
      prepararRegistro();
      break;
    case 'coleta-concluida':
      mostrarConclusao();
      break;
  }
}

function prepararAgendamento() {
  const titulo = `Coleta de ${coleta.pessoa}`;
  document.querySelector('h1').textContent = titulo;
  document.title = `${titulo} · E-Coleta`;
  document.querySelector('#horario').textContent = coleta.horario;
  document.querySelector('#endereco').textContent = coleta.endereco;
  document.querySelector('#itens').textContent = listarMateriais(coleta.itens);
  document.querySelector('#volume').textContent = coleta.volume;

  document.querySelector('#confirmar').addEventListener('click', () => {
    coleta.confirmada = true;
    salvarDados();
    location.href = `rota.html?id=${coleta.id}`;
  });
}

function prepararRegistro() {
  if (!estado.rascunhosColeta[id]) {
    estado.rascunhosColeta[id] = { faixa: 'Até 5 kg', foto: '' };
  }
  const rascunho = estado.rascunhosColeta[id];
  const formulario = document.querySelector('#registro-coleta');
  const campoFaixa = formulario.elements.faixa;
  const campoFoto = document.querySelector('#foto');

  document.querySelector('#itens').textContent = listarMateriais(coleta.itens);
  document.querySelector('#foto-status').hidden = !rascunho.foto;
  campoFaixa.value = rascunho.faixa;

  campoFaixa.addEventListener('change', () => {
    rascunho.faixa = campoFaixa.value;
    salvarDados();
  });

  campoFoto.addEventListener('change', async () => {
    const arquivo = campoFoto.files[0];
    if (!arquivo) {
      return;
    }

    try {
      rascunho.foto = await reduzirFoto(arquivo);
      salvarDados();
      document.querySelector('#foto-status').hidden = false;
    } catch {
      mostrarAviso('Não foi possível abrir a imagem.');
    }
  });

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    coleta.registro = {
      itens: structuredClone(coleta.itens),
      faixa: rascunho.faixa,
      foto: rascunho.foto,
    };
    coleta.situacao = 'concluida';
    coleta.concluidaEm = new Date().toISOString();
    salvarDados();
    location.href = `concluida.html?id=${coleta.id}`;
  });
}

async function reduzirFoto(arquivo) {
  if (!arquivo.type.startsWith('image/')) {
    throw new Error('Escolha uma imagem.');
  }

  const imagem = await createImageBitmap(arquivo);
  const escala = Math.min(1, 800 / Math.max(imagem.width, imagem.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);
  imagem.close();
  return canvas.toDataURL('image/jpeg', 0.7);
}

function mostrarConclusao() {
  if (!coleta.registro) {
    location.replace(`agendamento.html?id=${coleta.id}`);
    return;
  }

  const titulo = `Coleta de ${coleta.pessoa}`;
  document.querySelector('#nome-coleta').textContent = titulo;
  document.querySelector('#historico-coleta').textContent = titulo;
  document.querySelector('#quantidade-itens').textContent = coleta.registro.itens.length;
  document.querySelector('#faixa').textContent = coleta.registro.faixa;
  document.querySelector('#foto-anexada').hidden = !coleta.registro.foto;
  document.querySelector('#hora-coleta').textContent = formatarHora(coleta.concluidaEm);
}
