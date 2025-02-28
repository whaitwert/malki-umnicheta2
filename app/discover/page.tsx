"use client";

import { useState, useEffect } from "react";
import { getLatestGames, getMostPlayedGames } from "@/lib/firebase-utils";
import type { Game } from "@/lib/interfaces";
import GameCard from "@/components/game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DiscoverPage() {
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [mostPlayedGames, setMostPlayedGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const latest = await getLatestGames(10);
        const mostPlayed = await getMostPlayedGames(10);

        console.log("Latest Games:", latest);
        console.log("Most Played Games:", mostPlayed);

        setLatestGames(latest);
        setMostPlayedGames(mostPlayed);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(
          "An error occurred while fetching games. Please try again later."
        );
      }
    };
    fetchGames();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Открий Нови Игри</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Най-нови Игри</h2>
        {latestGames.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {latestGames.map((game) => (
                <CarouselItem
                  key={game.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <GameCard {...game} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p>No latest games available.</p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Най-играни Игри</h2>
        {mostPlayedGames.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {mostPlayedGames.map((game) => (
                <CarouselItem
                  key={game.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <GameCard {...game} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p>No most played games available.</p>
        )}
      </section>
    </div>
  );
}
