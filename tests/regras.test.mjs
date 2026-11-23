import test from 'node:test';
import assert from 'node:assert/strict';
import { criarEstadoInicial, pontos } from '../src/dados.js';
import {
  lerPesoEmGramas,
  lerQuantidade,
  buscarPontos,
  validarCategoria,
  somarPesos,
} from '../src/regras.js';
import { carregarEstado, salvarEstado } from '../src/armazenamento.js';

test('peso aceita vírgula, ponto, várias casas decimais e a unidade kg', () => {
  assert.equal(lerPesoEmGramas('2,4'), 2400);
  assert.equal(lerPesoEmGramas('0.001'), 1);
  assert.equal(lerPesoEmGramas('3,1415'), 3142);
  assert.equal(lerPesoEmGramas('1,2345'), 1235);
  assert.equal(lerPesoEmGramas(',5'), 500);
  assert.equal(lerPesoEmGramas('2,4 kg'), 2400);
  assert.equal(lerPesoEmGramas('2kg'), 2000);
  assert.equal(lerPesoEmGramas('0'), 0);
  assert.equal(lerPesoEmGramas(''), 0);
  for (const entrada of ['-1', 'abc', '1,2,3', 'Infinity', '2 g'])
    assert.equal(lerPesoEmGramas(entrada), null);
  assert.equal(somarPesos([{ pesoGramas: 2400 }, { pesoGramas: 200 }, { pesoGramas: 600 }]), 3200);
  assert.equal(lerQuantidade('1.5'), null);
  assert.equal(lerQuantidade('0'), 0);
});
test('quantidade 0 indica categoria vazia e exige peso vazio ou 0', () => {
  const permitidos = ['notebook', 'celular', 'cabos'];
  assert.equal(
    validarCategoria({ material: 'cabos', quantidade: '0', peso: '' }, permitidos).categoria
      .pesoGramas,
    0,
  );
  assert.equal(
    validarCategoria({ material: 'cabos', quantidade: '0', peso: '0' }, permitidos).categoria
      .quantidade,
    0,
  );
  assert.ok(
    validarCategoria({ material: 'cabos', quantidade: '0', peso: '0,6' }, permitidos).erros.peso,
  );
  assert.ok(
    validarCategoria({ material: 'cabos', quantidade: '3', peso: '' }, permitidos).erros.peso,
  );
});
test('peso informado é por unidade e o total acompanha a quantidade', () => {
  const permitidos = ['notebook', 'celular', 'cabos'];
  const total = (quantidade, peso) =>
    validarCategoria({ material: 'celular', quantidade, peso }, permitidos).categoria.pesoGramas;
  assert.equal(total('1', '0,2'), 200);
  assert.equal(total('3', '0,2'), 600);
  assert.equal(total('1000000000', '0,2'), 200000000000);
  const cabos = validarCategoria(
    { material: 'cabos', quantidade: '3', peso: '3,1415' },
    permitidos,
  );
  assert.equal(cabos.categoria.pesoUnitarioGramas, 3142);
  assert.equal(cabos.categoria.pesoGramas, 9426);
  assert.ok(
    validarCategoria({ material: 'celular', quantidade: '9007199254740991', peso: '2' }, permitidos)
      .erros.quantidade,
  );
});
test('busca exige todos os materiais e ordena pela região escolhida', () => {
  const busca = { materiais: ['notebook', 'celular'], regiao: 'campus', coordenadas: null };
  assert.deepEqual(
    buscarPontos(pontos, busca).map((p) => p.id),
    ['campus', 'centro'],
  );
  assert.equal(buscarPontos(pontos, { ...busca, regiao: 'centro' })[0].id, 'centro');
  assert.equal(buscarPontos(pontos, { ...busca, materiais: [] }).length, 0);
  assert.equal(
    buscarPontos(pontos, { ...busca, coordenadas: { latitude: 0, longitude: 0 } }).length,
    0,
  );
});
test('formulário informa erros e preserva observação digitada', () => {
  const ruim = validarCategoria({ material: 'x', quantidade: '-1', peso: 'abc' }, ['notebook']);
  assert.deepEqual(Object.keys(ruim.erros), ['material', 'quantidade', 'peso']);
  const bom = validarCategoria(
    { material: 'notebook', quantidade: '1', peso: '2,4', observacoes: ' carcaça danificada ' },
    ['notebook'],
  );
  assert.equal(bom.categoria.observacoes, 'carcaça danificada');
});
test('persistência recupera dados válidos e trata bloqueio ou conteúdo inválido', () => {
  const memoria = new Map();
  const storage = { getItem: (k) => memoria.get(k), setItem: (k, v) => memoria.set(k, v) };
  const estado = criarEstadoInicial();
  estado.preferencias.contraste = true;
  assert.equal(salvarEstado(storage, estado), true);
  assert.equal(carregarEstado(storage).estado.preferencias.contraste, true);
  assert.equal(salvarEstado(null, estado), false);
  assert.ok(carregarEstado(null).aviso);
  storage.setItem('e-coleta-pacote3-v1', '{');
  assert.ok(carregarEstado(storage).aviso);
});
