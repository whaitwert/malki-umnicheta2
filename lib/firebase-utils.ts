import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  arrayUnion,
  Timestamp,
  orderBy,
  limit as FBLimit,
  deleteDoc,
} from "firebase/firestore"
import type { User, Game, UserStats } from "./interfaces"
import { auth, db } from "./firebase"

export const signOutUser = () => signOut(auth)

export const createUserProfile = async (user: FirebaseUser) => {
  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    const newUser: User = {
      id: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      role: "user",
    }
    await setDoc(userRef, newUser)
    return newUser
  }

  return userSnap.data() as User
}

export const getUserData = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as User
  }

  return null
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const statsRef = doc(db, "userStats", userId)
  const statsSnap = await getDoc(statsRef)

  if (statsSnap.exists()) {
    return statsSnap.data() as UserStats
  }

  return {
    gamesPlayed: 0,
    totalPlayTime: 0,
    favoriteGames: [],
  }
}

export const getUserGames = async (userId: string): Promise<Game[]> => {
  const gamesQuery = query(collection(db, "games"), where("creator.id", "==", userId))
  const gamesSnap = await getDocs(gamesQuery)

  return gamesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Game)
}

export const getLatestGames = async (limit = 10): Promise<Game[]> => {
  const gamesQuery = query(
    collection(db, "games"),
    where("isVerified", "==", true),
    orderBy("createdAt", "desc"),
    FBLimit(limit),
  )

  const gamesSnap = await getDocs(gamesQuery)
  const games = gamesSnap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      embedUrl: data.embedUrl,
      creator: {
        id: data.creator?.id ?? "Unknown",
        name: data.creator?.name ?? "Unknown",
      },
      grade: data.grade,
      subject: data.subject,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      playCount: data.playCount ?? 0,
    } as Game
  })

  console.log("Fetched games:", games) // Log the games array

  return games
}

export const getMostPlayedGames = async (limit = 10): Promise<Game[]> => {
  const gamesQuery = query(
    collection(db, "games"),
    where("isVerified", "==", true),
    orderBy("playCount", "desc"),
    FBLimit(limit),
  )
  const gamesSnap = await getDocs(gamesQuery)

  return gamesSnap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
      description: data.description,
      embedUrl: data.embedUrl,
      creator: {
        id: data.creator.id,
        name: data.creator.name,
      },
      grade: data.grade,
      subject: data.subject,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      playCount: data.playCount,
    } as Game
  })
}

export const incrementGamePlayCount = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId)
  await updateDoc(gameRef, {
    playCount: increment(1),
  })
}

export const addGameToFavorites = async (userId: string, gameId: string) => {
  const userStatsRef = doc(db, "userStats", userId)
  await updateDoc(userStatsRef, {
    favoriteGames: arrayUnion(gameId),
  })
}

export const submitGame = async (game: Omit<Game, "id" | "createdAt" | "playCount">) => {
  const newGameRef = doc(collection(db, "games"))
  const newGame: Game = {
    ...game,
    id: newGameRef.id,
    createdAt: Timestamp.now(),
    playCount: 0,
  }
  await setDoc(newGameRef, newGame)
  return newGame
}

export const getGameById = async (gameId: string): Promise<Game | null> => {
  const gameRef = doc(db, "games", gameId)
  const gameSnap = await getDoc(gameRef)

  if (gameSnap.exists()) {
    return { id: gameSnap.id, ...gameSnap.data() } as Game
  }

  return null
}

export const getPendingGames = async (): Promise<Game[]> => {
  const gamesQuery = query(collection(db, "games"), where("isVerified", "==", false))
  const gamesSnap = await getDocs(gamesQuery)

  return gamesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Game)
}

export const approveGame = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "games", gameId)
  await updateDoc(gameRef, { isVerified: true })
}

export const rejectGame = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "games", gameId)
  await deleteDoc(gameRef)
}

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const userData = await getUserData(user.uid)
    return userData as User
  } catch (error) {
    console.error("Error signing in with email and password", error)
    throw error
  }
}

export const registerAndSignInWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await updateProfile(user, { displayName: name })
    const newUser = await createUserProfile(user)
    return newUser
  } catch (error) {
    console.error("Error registering and signing in with email and password", error)
    throw error
  }
}

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const signedInUser = await createUserProfile(user)
    return signedInUser
  } catch (error) {
    console.error("Error signing in with Google", error)
    throw error
  }
}

export const getGamesByGrade = async (grade: number): Promise<Game[]> => {
  const gamesQuery = query(
    collection(db, "games"),
    where("isVerified", "==", true),
    where("grade", "==", grade),
    orderBy("createdAt", "desc"),
  )
  const gamesSnap = await getDocs(gamesQuery)

  return gamesSnap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      embedUrl: data.embedUrl,
      creator: {
        id: data.creator.id,
        name: data.creator.name,
      },
      grade: data.grade,
      subject: data.subject,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      playCount: data.playCount,
    } as Game
  })
}

export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "games", gameId);
  await deleteDoc(gameRef);
}

