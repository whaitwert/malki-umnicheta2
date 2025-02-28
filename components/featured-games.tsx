import GameCard from "./game-card";

const featuredGames = [
  {
    title: "Математическо Приключение",
    description: "Забавна игра за усвояване на основни математически операции",
    embedUrl: "https://example.com/game1",
    creator: {
      id: "ivan123",
      name: "Иван Иванов"
    },
    grade: 2,
    subject: "Математика",
    isVerified: true,
  },
  {
    title: "Буквено Съкровище",
    description: "Открий съкровището, като подреждаш думи правилно",
    embedUrl: "https://example.com/game2",
    creator: {
      id: "maria456",
      name: "Мария Петрова"
    },
    grade: 1,
    subject: "Български език",
    isVerified: true,
  },
  // Add more featured games as needed
];

export default function FeaturedGames() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Популярни Игри</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGames.map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>
    </section>
  );
}
