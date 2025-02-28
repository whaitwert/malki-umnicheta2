"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { submitGame } from "@/lib/firebase-utils";
import { uploadImageToImgBB } from "@/lib/imgbb-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SubmitGame() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    embedUrl: "",
    grade: "",
    subject: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Трябва да сте влезли в профила си, за да добавите игра.");
      return;
    }
    if (!thumbnail) {
      alert("Моля, изберете снимка за играта.");
      return;
    }
    setIsSubmitting(true);
    try {
      const thumbnailUrl = await uploadImageToImgBB(thumbnail);
      const newGame = await submitGame({
        ...formData,
        creator: {
          id: user.id,
          name: user.name,
        },
        grade: Number.parseInt(formData.grade),
        isVerified: false,
        thumbnailUrl,
      });
      alert("Играта е изпратена за одобрение!");
      router.push("/");
    } catch (error) {
      console.error("Error submitting game:", error);
      alert("Възникна грешка при изпращането на играта.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex-1 container mx-auto px-4 py-8">Зареждане...</div>;
  }

  if (!user) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>
            Трябва да сте влезли в профила си, за да добавите игра.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Добави Нова Игра</h1>
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        <form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-1/2">
          <div>
            <label htmlFor="title" className="block mb-1">
              Заглавие
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">
              Описание
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="embedUrl" className="block mb-1">
              URL на играта
            </label>
            <Input
              id="embedUrl"
              name="embedUrl"
              value={formData.embedUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="thumbnail" className="block mb-1">
              Снимка
            </label>
            <Input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              ref={fileInputRef}
              required
            />
          </div>
          <div>
            <label htmlFor="grade" className="block mb-1">
              Клас
            </label>
            <Select onValueChange={(value) => handleSelectChange("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Избери клас" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 клас</SelectItem>
                <SelectItem value="2">2 клас</SelectItem>
                <SelectItem value="3">3 клас</SelectItem>
                <SelectItem value="4">4 клас</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1">
              Предмет
            </label>
            <Select
              onValueChange={(value) => handleSelectChange("subject", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Избери предмет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Математика">Математика</SelectItem>
                <SelectItem value="Български език">Български език</SelectItem>
                <SelectItem value="Околен свят">Околен свят</SelectItem>
                <SelectItem value="Изобразително изкуство">
                  Изобразително изкуство
                </SelectItem>
                <SelectItem value="Музика">Музика</SelectItem>
                <SelectItem value="Физическо възпитание">
                  Физическо възпитание
                </SelectItem>
                <SelectItem value="Друго">Друго</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Изпращане..." : "Изпрати за Одобрение"}
          </Button>
        </form>
        <div className="w-full lg:w-1/2 flex items-start justify-center">
          <video 
            src="/video1.mp4" 
            className="w-full max-w-[600px] rounded-lg shadow-lg"
            height="auto"
            controls 
            autoPlay 
          />
        </div>
      </div>
    </div>
  );
}
