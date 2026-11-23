// Quantidade inteira, zero ou maior. Zero indica que a categoria não veio no lote.
export function lerQuantidade(valor) {
  const texto = String(valor).trim();
  if (!/^\d+$/.test(texto)) {
    return null;
  }
  const numero = Number(texto);
  return Number.isSafeInteger(numero) ? numero : null;
}

// Peso em kg, com vírgula ou ponto e quantas casas decimais forem digitadas
// ("3,1415", ",5", "2,4 kg"). O resultado é arredondado para gramas. Vazio conta como zero.
export function lerPesoEmGramas(valor) {
  const texto = String(valor)
    .trim()
    .replace(/\s*kg$/i, '');
  if (texto === '') {
    return 0;
  }
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(texto)) {
    return null;
  }
  const gramas = Math.round(Number(texto.replace(',', '.')) * 1000);
  return Number.isSafeInteger(gramas) ? gramas : null;
}

export function formatarPeso(gramas) {
  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 3,
  }).format(gramas / 1000)} kg`;
}

export function somarPesos(categorias) {
  return categorias.reduce((total, categoria) => total + categoria.pesoGramas, 0);
}

// O peso informado é o de cada unidade. O peso da categoria é quantidade × peso por unidade.
export function validarCategoria(campos, materiaisPermitidos) {
  const erros = {};
  const quantidade = lerQuantidade(campos.quantidade);
  const pesoUnitarioGramas = lerPesoEmGramas(campos.peso);
  if (!materiaisPermitidos.includes(campos.material)) {
    erros.material = 'Escolha uma categoria.';
  }
  if (quantidade === null) {
    erros.quantidade = 'Informe uma quantidade inteira. Use 0 se não veio nenhum item.';
  }
  if (pesoUnitarioGramas === null) {
    erros.peso = 'Informe o peso de cada unidade em kg. Exemplo: 2,4.';
  } else if (quantidade === 0 && pesoUnitarioGramas > 0) {
    erros.peso = 'Com quantidade 0, deixe o peso vazio ou 0.';
  } else if (quantidade > 0 && pesoUnitarioGramas === 0) {
    erros.peso = 'Informe o peso de cada unidade, maior que zero, em kg. Exemplo: 2,4.';
  }

  const pesoGramas = quantidade * pesoUnitarioGramas;
  if (!Object.keys(erros).length && !Number.isSafeInteger(pesoGramas)) {
    erros.quantidade = 'Quantidade e peso grandes demais para calcular o total.';
  }

  return {
    erros,
    categoria: Object.keys(erros).length
      ? null
      : {
          material: campos.material,
          quantidade,
          pesoUnitarioGramas,
          pesoGramas,
          observacoes: String(campos.observacoes || '').trim(),
        },
  };
}

function distanciaEmMetros(a, b) {
  const rad = (graus) => (graus * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export function buscarPontos(pontos, busca) {
  if (!busca.materiais.length) {
    return [];
  }
  return pontos
    .filter((ponto) => busca.materiais.every((material) => ponto.materiais.includes(material)))
    .map((ponto) => ({
      ...ponto,
      distancia: busca.coordenadas
        ? distanciaEmMetros(busca.coordenadas, ponto)
        : ponto.distancias[busca.regiao],
    }))
    .filter((ponto) => Number.isFinite(ponto.distancia) && ponto.distancia <= 5000)
    .sort((a, b) => a.distancia - b.distancia);
}

export function formatarDistancia(metros) {
  return metros < 1000
    ? `${metros} m`
    : `${new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 1,
      }).format(metros / 1000)} km`;
}
