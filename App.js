import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { gameUtils, organizarJogos } from "./assets/utils/gameUtils";
import dados from "./assets/dados.json";
import DiaCard from "./components/Diacard";
import games from "./assets/game.json";
import { supabase } from "./services/supabase";

export async function importarJogos() {
  try {
    const { error } = await supabase.from("jogos").upsert(games, {
      onConflict: "id",
    });

    if (error) {
      console.log("Erro:", error.message);
      return;
    }

    console.log("Jogos importados com sucesso!");
  } catch (err) {
    console.log("Erro inesperado:", err);
  }
}

export default function App() {
  const [favoritos, setFavoritos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  const hoje = new Date().toISOString().split("T")[0];

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  const jogosAgrupados = useMemo(() => {
    return organizarJogos(dados.jogos, grupoSelecionado);
  }, [grupoSelecionado]);

  const grupos = [...new Set(dados.jogos.map((j) => j.grupo))].sort();

  return (
    <ImageBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image style={styles.logo} source={require("./assets/unicopa.png")} />
      <Text style={styles.title}>CALENDÁRIO</Text>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              !grupoSelecionado && styles.filterBtnActive,
            ]}
            onPress={() => setGrupoSelecionado(null)}
          >
            <Text style={styles.filterText}>Todos</Text>
          </TouchableOpacity>
          {grupos.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.filterBtn,
                grupoSelecionado === g && styles.filterBtnActive,
              ]}
              onPress={() => setGrupoSelecionado(g)}
            >
              <Text style={styles.filterText}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {Object.entries(jogosAgrupados).map(([data, jogosDoDia]) => (
          <DiaCard
            key={data}
            data={data}
            jogos={jogosDoDia}
            isHoje={data === hoje}
            favoritos={favoritos}
            onToggleFavorito={toggleFavorito}
          />
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#040b13", alignItems: "center" },
  logo: { marginTop: 50, width: 200, height: 50, resizeMode: "contain" },
  title: { marginTop: 10, fontSize: 28, fontWeight: "700", color: "white" },
  filterBar: {
    flexDirection: "row",
    marginVertical: 15,
    paddingHorizontal: 10,
    height: 40,
  },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a2a3a",
    marginHorizontal: 5,
    justifyContent: "center",
  },
  filterBtnActive: { backgroundColor: "#f2cc2f" },
  filterText: { color: "white", fontWeight: "bold" },
});
