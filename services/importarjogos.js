// src/services/importGames.js
// RF-010 — Importar jogos do JSON para o banco

import { supabase } from "../lib/supabase";
import gamesData from "../../assets/games.json"; // ajuste o caminho conforme seu projeto

/**
 * Importa todos os jogos do JSON para o Supabase.
 * Usa upsert para evitar duplicidade pelo campo `id`.
 *
 * @returns {{ inserted: number, error: string|null }}
 */
export async function importGamesFromJSON() {
  try {
    if (!gamesData || gamesData.length === 0) {
      return { inserted: 0, error: "O arquivo JSON está vazio." };
    }

    const { data, error } = await supabase
      .from("games")
      .upsert(gamesData, {
        onConflict: "id", // evita duplicidade pelo campo id
        ignoreDuplicates: false, // atualiza se já existir
      })
      .select();

    if (error) {
      console.error("[importGamesFromJSON] Erro no Supabase:", error.message);
      return { inserted: 0, error: error.message };
    }

    return { inserted: data?.length ?? 0, error: null };
  } catch (err) {
    console.error("[importGamesFromJSON] Erro inesperado:", err);
    return { inserted: 0, error: "Erro inesperado ao importar jogos." };
  }
}
