import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Game } from "@/lib/interfaces";
import { useUser } from "@/contexts/UserContext";
import { deleteGame } from "@/lib/firebase-utils";
import { useState } from "react";

interface GameCardProps extends Partial<Game> {
  onDelete?: () => void;
}

export default function GameCard({
  id,
  title,
  description,
  thumbnailUrl,
  creator,
  grade,
  subject,
  isVerified,
  onDelete,
}: GameCardProps) {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = user && (
    user.role === "admin" || 
    (creator && user.id === creator.id)
  );

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this game?")) return;
    
    try {
      setIsDeleting(true);
      await deleteGame(id);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Failed to delete the game. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col card-hover">
      <CardHeader className="space-y-2">
        <CardTitle className="flex justify-between items-start gap-2">
          <span className="text-lg sm:text-xl font-comic text-primary truncate">
            {title || "Untitled Game"}
          </span>
          <Badge variant={isVerified ? "default" : "secondary"} className="shrink-0 mt-1">
            {isVerified ? "Одобрена" : "Чакаща"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-video mb-4 overflow-hidden rounded-md">
          <Image
            src={thumbnailUrl || "/placeholder.svg"}
            alt={title || "Game thumbnail"}
            width={300}
            height={169}
            className="rounded-md object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
        <p className="text-sm mb-4 line-clamp-2 text-muted-foreground min-h-[2.5rem]">
          {description || "No description available"}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="font-comic text-xs sm:text-sm">
            {grade || "N/A"} клас
          </Badge>
          <Badge variant="outline" className="font-comic text-xs sm:text-sm">
            {subject || "N/A"}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm font-medium">
          Създател: <span className="text-primary">{creator?.name || "Unknown"}</span>
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Link href={`/play/${id}`} className="flex-1">
          <Button className="w-full font-comic hover:scale-105 transition-transform text-sm sm:text-base">
            Играй
          </Button>
        </Link>
        {canDelete && (
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="hover:scale-105 transition-transform text-sm sm:text-base"
          >
            {isDeleting ? "Изтриване..." : "Изтрий"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
