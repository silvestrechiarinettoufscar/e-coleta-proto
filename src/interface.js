import { materiais } from './dados.js';

export const nomeMaterial = (id) => materiais.find((material) => material.id === id)?.nome || id;

export const listarMateriais = (itens) =>
  itens.map((item) => nomeMaterial(item.material)).join(' · ');

export const formatarHora = (data) =>
  new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

export function mostrarErros(formulario, mensagens) {
  formulario
    .querySelectorAll('[aria-invalid]')
    .forEach((elemento) => elemento.removeAttribute('aria-invalid'));
  formulario.querySelectorAll('.erro-campo').forEach((elemento) => {
    elemento.hidden = true;
  });
  for (const [id, mensagem] of Object.entries(mensagens)) {
    const alvo = formulario.querySelector(`#${id}`);
    const aviso = formulario.querySelector(`#erro-${id}`);
    alvo?.setAttribute('aria-invalid', 'true');
    if (aviso) {
      aviso.textContent = mensagem;
      aviso.hidden = false;
    }
  }
  formulario.querySelector('[aria-invalid="true"]')?.focus();
  return Object.keys(mensagens).length > 0;
}

export function mostrarAviso(texto) {
  const mensagem = document.querySelector('#mensagem');
  mensagem.textContent = texto;
  mensagem.hidden = false;
}
