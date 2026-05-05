import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import GameCard from "./components/GameCard";
import dados from "./assets/dados.json";

export default function App() {
  const jogos = dados.jogos;

  const agruparPorData = (jogos) => {
    return jogos.reduce((acc, jogo) => {
      const data = jogo.data_brasilia;

      if (!acc[data]) {
        acc[data] = [];
      }

      acc[data].push(jogo);
      return acc;
    }, {});
  };

  const jogosAgrupados = agruparPorData(jogos);

  return (
    <ImageBackground style={styles.container}>
      <Image style={styles.logo} source={require("./assets/unicopa.png")} />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(jogosAgrupados).map(([data, jogosDoDia]) => (
          <View style={styles.card} key={data}>
            <Text style={styles.data}>
              {data.split("-").slice(1).reverse().join("/")}
            </Text>

            {jogosDoDia.map((jogo, index) => (
              <GameCard key={index} game={jogo} />
            ))}
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040b13",
    alignItems: "center",
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  card: {
    marginTop: 20,
    backgroundColor: "#0c1b2a",
    width: 320,
    borderRadius: 12,
    padding: 15,
  },
  data: {
    color: "#f2cc2f",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
