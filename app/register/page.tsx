"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerAndSignInWithEmailAndPassword,
  signInWithGoogle,
} from "@/lib/firebase-utils";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Паролите не съвпадат");
      return;
    }

    try {
      const newUser = await registerAndSignInWithEmailAndPassword(
        name,
        email,
        password
      );
      setUser(newUser);
      router.push("/");
    } catch {
      setError("Грешка при регистрация на потребителя");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      router.push("/");
    } catch {
      setError("Грешка при регистрация с Google");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Регистрация</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleRegister} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block mb-1">
            Име
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Имейл
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Парола
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Потвърди парола
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Регистрация</Button>
      </form>
      <div className="mt-4">
        <Button onClick={handleGoogleRegister} variant="outline">
          Регистрация с Google
        </Button>
      </div>
      <p className="mt-4">
        Вече имате акаунт?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Влезте
        </Link>
      </p>
    </div>
  );
}
