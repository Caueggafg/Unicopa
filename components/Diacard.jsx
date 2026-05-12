import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GameCard from "./GameCard";
import { formatarDataBR } from "../assets/utils/gameUtils";

export default function DiaCard({
  data,
  jogos,
  isHoje,
  favoritos,
  onToggleFavorito,
}) {
  return (
    <View style={[styles.card, isHoje && styles.cardHoje]}>
      <View style={styles.headerCard}>
        <Text style={styles.data}>{formatarDataBR(data)}</Text>
        {isHoje && <Text style={styles.badgeHoje}>HOJE</Text>}
      </View>

      {jogos.map((jogo) => {
        const isBrasil = jogo.time_casa === "BRA" || jogo.time_fora === "BRA";

        return (
          <TouchableOpacity
            key={jogo.id}
            onPress={() => onToggleFavorito(jogo.id)}
            activeOpacity={0.8}
            style={[styles.gameWrapper, isBrasil && styles.highlightBrasil]}
          >
            <GameCard game={jogo} isFavorito={favoritos.includes(jogo.id)} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "#0c1b2a",
    width: 340,
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardHoje: { borderColor: "#f2cc2f" },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  data: { color: "#f2cc2f", fontSize: 22, fontWeight: "bold" },
  badgeHoje: {
    backgroundColor: "#f2cc2f",
    paddingHorizontal: 8,
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  gameWrapper: { borderRadius: 8, marginVertical: 4 },
  highlightBrasil: {
    backgroundColor: "rgba(0, 151, 57, 0.1)",
    borderLeftWidth: 5,
    borderLeftColor: "#009739",
  },
});
