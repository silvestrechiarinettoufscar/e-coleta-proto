import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const paginas = [
  'index.html',
  'pages/descarte/index.html',
  'pages/descarte/materiais.html',
  'pages/descarte/pontos.html',
  'pages/descarte/detalhes.html',
  'pages/descarte/rota.html',
  'pages/coleta/index.html',
  'pages/coleta/agendamento.html',
  'pages/coleta/rota.html',
  'pages/coleta/registro.html',
  'pages/coleta/concluida.html',
  'pages/triagem/index.html',
  'pages/triagem/conferencia.html',
  'pages/triagem/formulario.html',
  'pages/triagem/revisao.html',
  'pages/triagem/concluida.html',
  'pages/acessibilidade/index.html',
  'pages/acessibilidade/texto.html',
];

export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      input: paginas.map((pagina) => fileURLToPath(new URL(pagina, import.meta.url))),
    },
  },
});
