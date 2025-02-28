"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getUserData, getUserStats, getUserGames } from "@/lib/firebase-utils"
import type { User, UserStats, Game } from "@/lib/interfaces"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameCard from "@/components/game-card"

export default function UserProfile() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof id === "string") {
        const userData = await getUserData(id)
        const userStats = await getUserStats(id)
        const userGames = await getUserGames(id)
        setUser(userData)
        setStats(userStats)
        setGames(userGames)
      }
    }
    fetchUserData()
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Avatar className="h-24 w-24 mr-4">
          <AvatarImage src={user.photoURL} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Изиграни Игри</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.gamesPlayed || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Общо Време за Игра</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.totalPlayTime || 0} мин.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Любими Игри</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.favoriteGames.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Качени Игри</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  )
}

