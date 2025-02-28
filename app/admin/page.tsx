"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { getPendingGames, approveGame, rejectGame } from "@/lib/firebase-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Game } from "@/lib/interfaces";
import Image from "next/image";

export default function AdminDashboard() {
  const [pendingGames, setPendingGames] = useState<Game[]>([]);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPendingGames = async () => {
      const games = await getPendingGames();
      setPendingGames(games);
    };

    if (user && user.role === "admin") {
      fetchPendingGames();
    }
  }, [user]);

  const handleApprove = async (gameId: string) => {
    await approveGame(gameId);
    setPendingGames((prevGames) =>
      prevGames.filter((game) => game.id !== gameId)
    );
  };

  const handleReject = async (gameId: string) => {
    await rejectGame(gameId);
    setPendingGames((prevGames) =>
      prevGames.filter((game) => game.id !== gameId)
    );
  };

  if (loading || !user || user.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Админ Панел - Одобрение на Игри
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingGames.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={game.thumbnailUrl || "/placeholder.svg"}
                alt={game.title}
                width={300}
                height={169}
                className="rounded-md object-cover w-full h-40 mb-4"
              />
              <p className="mb-2">{game.description}</p>
              <p className="text-sm text-muted-foreground">
                Клас: {game.grade} | Предмет: {game.subject}
              </p>
              <p className="text-sm text-muted-foreground">
                Създател: {game.creator.name}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleApprove(game.id)} variant="default">
                Одобри
              </Button>
              <Button
                onClick={() => handleReject(game.id)}
                variant="destructive"
              >
                Отхвърли
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
