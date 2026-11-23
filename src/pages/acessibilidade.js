import { aplicarPreferencias } from '../main.js';
import { estado, salvarDados } from '../estado.js';

for (const [id, preferencia] of [
  ['alto-contraste', 'contraste'],
  ['texto-ampliado', 'textoAmpliado'],
]) {
  const campo = document.getElementById(id);
  if (campo) {
    campo.checked = Boolean(estado.preferencias[preferencia]);
    campo.addEventListener('change', () => {
      estado.preferencias[preferencia] = campo.checked;
      salvarDados();
      aplicarPreferencias();
    });
  }
}

const parametros = new URLSearchParams(location.search);
const voltar = parametros.get('voltar');
const destino = new URL(voltar || '../../index.html', location.href);

if (destino.origin === location.origin) {
  const linkVoltar = document.querySelector('#voltar');
  if (linkVoltar) {
    linkVoltar.href = destino.href;
  }
}

const demonstrar = document.querySelector('#demonstrar-texto');
const voltarAcessibilidade = document.querySelector('#voltar-acessibilidade');

for (const link of [demonstrar, voltarAcessibilidade]) {
  if (link && voltar) {
    const url = new URL(link.href);
    url.searchParams.set('voltar', voltar);
    link.href = url.href;
  }
}
