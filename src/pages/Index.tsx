import { GameCard } from "@/components/GameCard";
import { WaveCatcher } from "@/components/WaveCatcher";
import { useState } from "react";
import { Waveform } from "lucide-react";

export default function Index() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === "wavecatcher") {
    return <WaveCatcher />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900">
      <div className="container mx-auto py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Физика звука
          </h1>
          <p className="text-xl text-gray-300">
            Изучайте физику звука через увлекательные игры
          </p>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          <GameCard
            title="Wave Catcher"
            description="Поймайте инфразвуковые волны и избегайте обычных звуковых волн"
            icon={<Waveform className="w-12 h-12" />}
            onClick={() => setSelectedGame("wavecatcher")}
          />
          {/* Здесь будут добавлены карточки других игр */}
        </div>
      </div>
    </div>
  );
}