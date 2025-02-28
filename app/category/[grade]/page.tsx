"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getGamesByGrade } from "@/lib/firebase-utils";
import type { Game } from "@/lib/interfaces";
import GameCard from "@/components/game-card";

export default function CategoryPage() {
  const { grade } = useParams();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      if (typeof grade === "string") {
        const fetchedGames = await getGamesByGrade(Number.parseInt(grade));
        setGames(fetchedGames);
        setLoading(false);
      }
    };
    fetchGames();
  }, [grade]);

  if (loading) {
    return <div className="flex-1 container mx-auto px-4 py-8">Зареждане...</div>;
  }

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Игри за {grade} Клас</h1>
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
          {games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg flex-1">Няма намерени игри за този клас.</p>
      )}
    </div>
  );
}
