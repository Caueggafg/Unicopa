export const formatarDataBR = (dataString) => {
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}`;
};

export const organizarJogos = (jogos, grupoSelecionado) => {
  let listaFiltrada = [...jogos];

  if (grupoSelecionado) {
    listaFiltrada = listaFiltrada.filter((j) => j.grupo === grupoSelecionado);
  }

  listaFiltrada.sort((a, b) => a.hora_brasilia.localeCompare(b.hora_brasilia));

  return listaFiltrada.reduce((acc, jogo) => {
    const data = jogo.data_brasilia;
    if (!acc[data]) acc[data] = [];
    acc[data].push(jogo);
    return acc;
  }, {});
};
