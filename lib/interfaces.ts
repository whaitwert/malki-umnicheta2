import type { Timestamp } from "firebase/firestore"

export interface User {
  id: string
  name: string
  email: string
  photoURL: string
  role: "user" | "admin"
}

export interface Game {
  id: string
  title: string
  description: string
  embedUrl: string
  thumbnailUrl: string 
  creator: {
    id: string
    name: string
  }
  grade: number
  subject: string
  isVerified: boolean
  createdAt: Timestamp
  playCount: number
}

export interface UserStats {
  gamesPlayed: number
  totalPlayTime: number
  favoriteGames: string[]
}

