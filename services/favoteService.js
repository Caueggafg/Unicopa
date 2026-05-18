// src/services/favoritesService.js
// RF-012 — Favoritar jogos

import { supabase } from "../lib/supabase";

const USER_ID = "default_user"; // substitua por auth.uid() quando usar autenticação

/**
 * Retorna todos os IDs de jogos favoritados pelo usuário.
 * @returns {string[]} Lista de game_ids
 */
export async function getFavoriteIds() {
  const { data, error } = await supabase
    .from("favorites")
    .select("game_id")
    .eq("user_id", USER_ID);

  if (error) {
    console.error("[getFavoriteIds]", error.message);
    return [];
  }

  return data.map((f) => f.game_id);
}

/**
 * Adiciona um jogo aos favoritos.
 * @param {string} gameId
 * @returns {{ success: boolean, error: string|null }}
 */
export async function addFavorite(gameId) {
  const { error } = await supabase
    .from("favorites")
    .insert({ game_id: gameId, user_id: USER_ID });

  if (error) {
    // Código 23505 = unique_violation (já favoritado)
    if (error.code === "23505") {
      return { success: true, error: null }; // idempotente
    }
    console.error("[addFavorite]", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Remove um jogo dos favoritos.
 * @param {string} gameId
 * @returns {{ success: boolean, error: string|null }}
 */
export async function removeFavorite(gameId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("game_id", gameId)
    .eq("user_id", USER_ID);

  if (error) {
    console.error("[removeFavorite]", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Alterna favorito: adiciona se não existir, remove se já existir.
 * @param {string} gameId
 * @param {boolean} isFavorited - estado atual
 * @returns {{ success: boolean, error: string|null }}
 */
export async function toggleFavorite(gameId, isFavorited) {
  if (isFavorited) {
    return removeFavorite(gameId);
  } else {
    return addFavorite(gameId);
  }
}
