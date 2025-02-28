"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getGameById, incrementGamePlayCount } from "@/lib/firebase-utils";
import type { Game } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlayGame() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (typeof id === "string") {
        const fetchedGame = await getGameById(id);
        setGame(fetchedGame);
        if (fetchedGame) {
          incrementGamePlayCount(fetchedGame.id);
        }
      }
    };
    fetchGame();
  }, [id]);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{game.title}</h1>
      <div className="mb-8">
        <iframe
          src={game.embedUrl}
          className="w-full aspect-video rounded-lg shadow-lg"
        ></iframe>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация за Играта</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Описание:</strong> {game.description}
            </p>
            <p>
              <strong>Клас:</strong> {game.grade}
            </p>
            <p>
              <strong>Предмет:</strong> {game.subject}
            </p>
            <p>
              <strong>Създател:</strong> {game.creator.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Брой изигравания:</strong> {game.playCount}
            </p>
            {/* Add more statistics here as needed */}
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={() => window.history.back()}>Назад към Игрите</Button>
      </div>
    </div>
  );
}
