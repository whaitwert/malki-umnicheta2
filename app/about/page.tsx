"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-5xl font-bold mb-8 text-center font-comic"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          За Малки Умничета
        </motion.h1>

        <motion.div
          className="bg-white text-purple-900 rounded-3xl shadow-xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4">Нашата Мисия</h2>
          <p className="text-xl mb-6">
            Малки Умничета е създадена с мисията да направи ученето забавно и
            вълнуващо за децата от 1 до 4 клас. Вярваме, че чрез интерактивни
            образователни игри можем да вдъхновим любов към знанието и да
            помогнем на децата да развият важни умения по забавен начин.
          </p>
          <h2 className="text-3xl font-bold mb-4">Какво Предлагаме</h2>
          <ul className="list-disc list-inside text-xl mb-6">
            <li>Разнообразие от образователни игри за всички предмети</li>
            <li>Съдържание, адаптирано за ученици от 1 до 4 клас</li>
            <li>Интерактивна и ангажираща учебна среда</li>
            <li>Възможност за създаване и споделяне на собствени игри</li>
            <li>Безопасна и защитена онлайн платформа за деца</li>
          </ul>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-blue-200 text-purple-900 rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4">За Родители</h2>
            <p className="text-xl mb-4">
              Малки Умничета предоставя безопасна и образователна среда за
              вашите деца. Можете да следите прогреса им и да им помагате в
              тяхното обучение чрез забавни игри.
            </p>
            <Link href="/for-parents"></Link>
          </div>
          <div className="bg-pink-200 text-purple-900 rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4">За Учители</h2>
            <p className="text-xl mb-4">
              Използвайте нашата платформа като допълнение към вашите уроци.
              Създавайте собствени образователни игри и ангажирайте учениците си
              по нов и вълнуващ начин.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Готови ли сте да започнете?
          </h2>
          <Link href="/discover">
            <Button
              size="lg"
              className="text-xl bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-4 px-8 rounded-full transform transition hover:scale-105"
            >
              Открийте Нашите Игри
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
