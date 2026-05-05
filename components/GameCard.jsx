import { Image, StyleSheet, Text, View } from "react-native";

export default function GameCard({ game }) {
  const flags = {
    MEX: require("../assets/jogos/mexico.png"),
    RSA: require("../assets/jogos/south africa.png"),
    KOR: require("../assets/jogos/south korea.png"),
    CZE: require("../assets/jogos/czech republic.png"),
    CAN: require("../assets/jogos/canada.png"),
    BIH: require("../assets/jogos/bosnia.png"),
    USA: require("../assets/jogos/united states.png"),
    PAR: require("../assets/jogos/paraguay.png"),
    HAI: require("../assets/jogos/haiti.png"),
    SCO: require("../assets/jogos/scotland.png"),
    AUS: require("../assets/jogos/australia.png"),
    TUR: require("../assets/jogos/turkey.png"),
    BRA: require("../assets/jogos/brazil.png"),
    MAR: require("../assets/jogos/morocco.png"),
    QAT: require("../assets/jogos/qatar.png"),
    SUI: require("../assets/jogos/switzerland.png"),
  };

  return (
    <View style={styles.jogo}>
      <Text style={styles.grupo}>
        GRUPO {game.grupo} {game.confronto}
      </Text>

      <View style={styles.linhaPrincipal}>
        <View style={styles.time}>
          <Image style={styles.bandeira} source={flags[game.sigla_casa]} />
          <Text style={styles.sigla}>{game.sigla_casa}</Text>
        </View>

        <View style={styles.horario}>
          <Text style={styles.hora}>{game.hora_brasilia}</Text>
          <Text style={styles.subTitulo}>VS</Text>
        </View>

        <View style={styles.time}>
          <Text style={styles.sigla}>{game.sigla_fora}</Text>
          <Image style={styles.bandeira} source={flags[game.sigla_fora]} />
        </View>
      </View>

      <View style={styles.local}>
        <Text style={styles.subTitulo}>{game.estadio}</Text>
        <Text style={styles.subTitulo}>
          {game.cidade} • {game.pais}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  jogo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d3d",
    paddingBottom: 15,
  },
  grupo: {
    color: "#8fa3b8",
    fontSize: 12,
    marginBottom: 10,
  },
  linhaPrincipal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bandeira: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sigla: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  horario: {
    alignItems: "center",
  },
  hora: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  local: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitulo: {
    color: "#8fa3b8",
    fontSize: 12,
  },
});
