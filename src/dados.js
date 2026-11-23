export const materiais = [
  {
    id: 'notebook',
    nome: 'Notebook',
    plural: 'Notebooks',
  },
  {
    id: 'celular',
    nome: 'Celular',
    plural: 'Celulares',
  },
  {
    id: 'cabos',
    nome: 'Cabos',
    plural: 'Cabos',
  },
];

// Coordenadas e distâncias servem apenas à demonstração. Não são pontos reais.

export const pontos = [
  {
    id: 'campus',
    nome: 'Ponto Campus',
    endereco: 'Rua de exemplo, 100',
    horario: 'Seg. a sex., das 8h às 17h',
    materiais: ['notebook', 'celular', 'cabos'],
    latitude: -22.009,
    longitude: -47.899,
    distancias: {
      campus: 650,
      centro: 1800,
      'santa-felicia': 2100,
    },
  },
  {
    id: 'centro',
    nome: 'Ponto Centro',
    endereco: 'Rua de exemplo, 240',
    horario: 'Seg. a sex., das 9h às 16h',
    materiais: ['notebook', 'celular', 'cabos'],
    latitude: -22.018,
    longitude: -47.889,
    distancias: {
      campus: 1400,
      centro: 450,
      'santa-felicia': 3100,
    },
  },
];

export function criarEstadoInicial() {
  return {
    versao: 1,
    preferencias: {
      contraste: false,
      textoAmpliado: false,
    },
    busca: {
      materiais: ['notebook', 'celular', 'cabos'],
      regiao: 'campus',
      coordenadas: null,
    },
    coletas: [
      {
        id: 'C-001',
        pessoa: 'Beatriz',
        endereco: 'Rua de exemplo, 80',
        horario: '9h às 10h',
        ordem: '09:00',
        volume: '1 caixa',
        situacao: 'agendada',
        confirmada: false,
        itens: [
          {
            material: 'notebook',
            quantidade: 1,
          },
          {
            material: 'celular',
            quantidade: 1,
          },
          {
            material: 'cabos',
            quantidade: 3,
          },
        ],
      },
      {
        id: 'C-002',
        pessoa: 'Carla',
        endereco: 'Rua de exemplo, 120',
        horario: '10h30 às 11h30',
        ordem: '10:30',
        volume: '1 sacola',
        situacao: 'agendada',
        confirmada: false,
        itens: [
          {
            material: 'celular',
            quantidade: 2,
          },
          {
            material: 'cabos',
            quantidade: 3,
          },
        ],
      },
    ],
    lotes: [
      {
        id: 'EC-024',
        coletaId: null,
        origem: 'Coleta de Márcio',
        motorista: 'Márcio',
        recebidoEm: '10h15',
        situacao: 'pendente',
        faixa: 'Até 5 kg',
        previstos: [
          {
            material: 'notebook',
            quantidade: 1,
          },
          {
            material: 'celular',
            quantidade: 1,
          },
          {
            material: 'cabos',
            quantidade: 3,
          },
        ],
        categorias: [],
      },
      {
        id: 'EC-023',
        coletaId: null,
        origem: 'Coleta de Márcio',
        motorista: 'Márcio',
        recebidoEm: '9h40',
        situacao: 'concluido',
        faixa: 'Até 5 kg',
        previstos: [
          {
            material: 'celular',
            quantidade: 2,
          },
        ],
        categorias: [
          {
            material: 'celular',
            quantidade: 2,
            pesoUnitarioGramas: 200,
            pesoGramas: 400,
            observacoes: '',
          },
        ],
      },
    ],
    rascunhosColeta: {},
    rascunhosTriagem: {},
  };
}
