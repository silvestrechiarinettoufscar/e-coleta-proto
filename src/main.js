import { tratarAcao } from './acoes.js';
import { estado } from './estado.js';

export function aplicarPreferencias() {
  document.documentElement.dataset.contraste = Boolean(estado.preferencias.contraste);
  document.documentElement.dataset.textoAmpliado = Boolean(estado.preferencias.textoAmpliado);
}

aplicarPreferencias();

const acessibilidade = document.querySelector('#acessibilidade');
if (acessibilidade) {
  const destino = new URL(acessibilidade.href);
  destino.searchParams.set('voltar', location.pathname + location.search);
  acessibilidade.href = destino.href;
}

document.addEventListener('click', tratarAcao);

document.addEventListener('input', (event) => {
  const campo = event.target;
  const mensagem = document.getElementById(`erro-${campo.id}`);
  campo.removeAttribute('aria-invalid');
  if (mensagem) {
    mensagem.hidden = true;
  }
});

// Ao voltar pelo navegador, recupera os registros atualizados em outra página.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    location.reload();
  }
});
