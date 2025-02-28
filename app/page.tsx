"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg font-comic">
            Добре дошли в Малки Умничета!
          </h1>
          <p className="text-3xl mb-8 text-white drop-shadow-md">
            Тук ученето е забавно приключение!
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Link href="/discover">
              <Button
                size="lg"
                className="text-xl bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-4 px-8 rounded-full transform transition hover:scale-105"
              >
                Открий Игри
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-xl bg-transparent border-4 border-white hover:bg-white hover:text-purple-900 font-bold py-4 px-8 rounded-full transform transition hover:scale-105"
              >
                Научи Повече
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[1, 2, 3, 4].map((grade) => (
            <Link key={grade} href={`/category/${grade}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-900 rounded-2xl shadow-lg p-6 text-center cursor-pointer transform transition"
              >
                <h2 className="text-4xl font-bold mb-2">{grade}</h2>
                <p className="text-xl">Клас</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-blue-200 p-8 rounded-2xl text-purple-900 shadow-lg transform transition hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">Учи чрез Игра</h2>
            <p className="text-xl">
              Открий забавни образователни игри за всички предмети!
            </p>
          </div>
          <div className="bg-purple-200 p-8 rounded-2xl text-purple-900 shadow-lg transform transition hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">За Всички Класове</h2>
            <p className="text-xl">Игри за ученици от 1 до 4 клас</p>
          </div>
          <div className="bg-pink-200 p-8 rounded-2xl text-purple-900 shadow-lg transform transition hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">Създай Своя Игра</h2>
            <p className="text-xl">
              Стани част от нашата общност и създай своя образователна игра!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
