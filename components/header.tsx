"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { signOutUser } from "@/lib/firebase-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

export default function Header() {
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Малки Умничета
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/discover">
                <Button variant="ghost">Открий</Button>
              </Link>
            </li>
            <li>
              <Link href="/submit-game">
                <Button variant="ghost">Добави Игра</Button>
              </Link>
            </li>
            {user && user.role === "admin" && (
              <li>
                <Link href="/admin">
                  <Button variant="ghost">Админ Панел</Button>
                </Link>
              </li>
            )}
            {!loading && (
              <>
                {user ? (
                  <>
                    <li>
                      <Link href={`/profile/${user.id}`}>
                        <Avatar>
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.name} />
                          ) : (
                            <AvatarFallback>
                              <UserIcon className="h-6 w-6" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </Link>
                    </li>
                    <li>
                      <Button variant="outline" onClick={handleSignOut}>
                        Изход
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login">
                        <Button variant="ghost">Вход</Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/register">
                        <Button
                          variant="outline"
                          className="text-gray-800 bg-white hover:bg-gray-100 hover:text-gray-900"
                        >
                          Регистрация
                        </Button>
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
