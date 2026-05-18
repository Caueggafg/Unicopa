import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { supabase } from "../lib/supabase";
import { importGamesFromJSON } from "../services/importGames";
import { getFavoriteIds, toggleFavorite } from "../services/favoritesService";

const COLORS = {
  bg: "#0F0F14",
  card: "#1A1A24",
  cardBorder: "#2A2A38",
  accent: "#7C5CFC",
  accentLight: "#A78BFA",
  gold: "#F59E0B",
  text: "#F1F0F5",
  muted: "#6B6880",
  success: "#10B981",
  error: "#EF4444",
};

function EmptyCard({ onImport, importing }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎮</Text>
      <Text style={styles.emptyTitle}>Nenhum jogo carregado</Text>
      <Text style={styles.emptySubtitle}>
        Importe os jogos do arquivo JSON para começar.
      </Text>
      <TouchableOpacity
        style={[styles.importBtn, importing && styles.importBtnDisabled]}
        onPress={onImport}
        disabled={importing}
      >
        {importing ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.importBtnText}>⬆ Importar Jogos</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function GameCard({ game, isFavorited, onToggleFavorite }) {
  return (
    <View style={styles.card}>
      {game.image_url ? (
        <Image
          source={{ uri: game.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.cardImagePlaceholderText}>🎮</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {game.title}
          </Text>
          <TouchableOpacity
            onPress={() => onToggleFavorite(game.id, isFavorited)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={
              isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Text style={styles.favoriteIcon}>{isFavorited ? "★" : "☆"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardTags}>
          {game.genre && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{game.genre}</Text>
            </View>
          )}
          {game.platform && (
            <View style={[styles.tag, styles.tagPlatform]}>
              <Text style={styles.tagText}>{game.platform}</Text>
            </View>
          )}
        </View>
        {game.description ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {game.description}
          </Text>
        ) : null}
        <View style={styles.cardFooter}>
          {game.developer && (
            <Text style={styles.cardMeta}>{game.developer}</Text>
          )}
          {game.rating != null && (
            <Text style={styles.cardRating}>⭐ {game.rating}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function GamesScreen() {
  const [games, setGames] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("title", { ascending: true });
      if (error) throw error;
      setGames(data ?? []);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os jogos.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    const ids = await getFavoriteIds();
    setFavoriteIds(new Set(ids));
  }, []);

  useEffect(() => {
    fetchGames();
    fetchFavorites();
  }, [fetchGames, fetchFavorites]);

  const handleImport = async () => {
    setImporting(true);
    const { inserted, error } = await importGamesFromJSON();
    setImporting(false);
    if (error) {
      Alert.alert("Erro na importação", error);
    } else {
      Alert.alert(
        "Importação concluída ✅",
        `${inserted} jogo(s) importado(s) com sucesso!`,
      );
      fetchGames();
    }
  };

  const handleToggleFavorite = async (gameId, isFavorited) => {
    // Atualização otimista
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFavorited ? next.delete(gameId) : next.add(gameId);
      return next;
    });
    const { success, error } = await toggleFavorite(gameId, isFavorited);
    if (!success) {
      // Reverte se der erro
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFavorited ? next.add(gameId) : next.delete(gameId);
        return next;
      });
      Alert.alert("Erro", error ?? "Não foi possível atualizar o favorito.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Carregando jogos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 Minha Biblioteca</Text>
        <TouchableOpacity
          style={styles.headerImportBtn}
          onPress={handleImport}
          disabled={importing}
        >
          {importing ? (
            <ActivityIndicator size="small" color={COLORS.accentLight} />
          ) : (
            <Text style={styles.headerImportText}>⬆ Importar</Text>
          )}
        </TouchableOpacity>
      </View>

      {games.length === 0 ? (
        <EmptyCard onImport={handleImport} importing={importing} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              isFavorited={favoriteIds.has(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centered: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { color: COLORS.muted, fontSize: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  headerImportBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.accent + "22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent + "55",
  },
  headerImportText: {
    color: COLORS.accentLight,
    fontSize: 13,
    fontWeight: "600",
  },
  list: { padding: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardImage: { width: "100%", height: 140, backgroundColor: COLORS.cardBorder },
  cardImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: COLORS.cardBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImagePlaceholderText: { fontSize: 36 },
  cardBody: { padding: 14, gap: 8 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 8,
  },
  favoriteIcon: { fontSize: 24, color: COLORS.gold },
  cardTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: COLORS.accent + "22",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagPlatform: { backgroundColor: COLORS.cardBorder },
  tagText: { color: COLORS.accentLight, fontSize: 11, fontWeight: "600" },
  cardDescription: { color: COLORS.muted, fontSize: 13, lineHeight: 18 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardMeta: { color: COLORS.muted, fontSize: 12 },
  cardRating: { color: COLORS.gold, fontSize: 13, fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyIcon: { fontSize: 64, marginBottom: 8 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  importBtn: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: "center",
  },
  importBtnDisabled: { opacity: 0.6 },
  importBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
