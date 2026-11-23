import { estado, salvarDados } from './estado.js';
import { mostrarAviso } from './interface.js';

function abrirGps(coletaId) {
  const coleta = estado.coletas.find((coleta) => coleta.id === coletaId);
  const destino = encodeURIComponent(`${coleta.endereco}, São Carlos`);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function usarLocalizacao(botao) {
  if (!navigator.geolocation) {
    mostrarAviso('Localização indisponível.');
    return;
  }
  botao.disabled = true;
  navigator.geolocation.getCurrentPosition(
    (posicao) => {
      estado.busca.coordenadas = {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      };
      estado.busca.localizacao = 'Localização atual';
      const campo = document.querySelector('#localizacao');
      if (campo) {
        campo.value = 'Localização atual';
      }
      salvarDados();
      botao.disabled = false;
    },
    () => {
      botao.disabled = false;
      mostrarAviso('Não foi possível obter a localização.');
    },
    {
      timeout: 10000,
    },
  );
}

function lerTela() {
  if (!window.speechSynthesis) {
    mostrarAviso('Leitura em voz alta indisponível neste navegador.');
    return;
  }
  const texto = document.querySelector('main').innerText;
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(fala);
}

function ditarObservacao(botao) {
  const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconhecimento) {
    mostrarAviso('Ditado indisponível neste navegador.');
    return;
  }
  const reconhecimento = new Reconhecimento();
  reconhecimento.lang = 'pt-BR';
  botao.disabled = true;
  reconhecimento.onresult = (event) => {
    const campo = document.querySelector('#observacoes');
    const texto = event.results[0][0].transcript;
    if (campo) {
      campo.value = `${campo.value} ${texto}`.trim();
    }
  };
  reconhecimento.onerror = () => {
    mostrarAviso('Não foi possível concluir o ditado.');
  };
  reconhecimento.onend = () => {
    botao.disabled = false;
  };
  try {
    reconhecimento.start();
  } catch {
    botao.disabled = false;
  }
  window.addEventListener('pagehide', () => reconhecimento.abort(), {
    once: true,
  });
}

export function tratarAcao(event) {
  const botao = event.target.closest('[data-acao]');
  if (!botao) {
    return;
  }
  const [acao, id] = botao.dataset.acao.split(':');
  switch (acao) {
    case 'foto':
      document.querySelector('#foto').click();
      break;
    case 'gps':
      abrirGps(id);
      break;
    case 'localizar':
      usarLocalizacao(botao);
      break;
    case 'ouvir':
      lerTela();
      break;
    case 'ditar':
      ditarObservacao(botao);
      break;
  }
}

window.addEventListener('pagehide', () => window.speechSynthesis?.cancel());
