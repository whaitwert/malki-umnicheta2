"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, signOut, type User } from "firebase/auth"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return (
    <>{user ? <Button onClick={handleSignOut}>Изход</Button> : <Button onClick={handleSignIn}>Вход с Google</Button>}</>
  )
}

