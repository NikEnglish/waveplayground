import { useState } from "react";
import { AudioWaveform, Box, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GameCard } from "@/components/GameCard";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGameSelect = (game: string) => {
    toast({
      title: "Игра выбрана",
      description: "Загрузка игры...",
    });
    
    switch (game) {
      case "wavecatcher":
        navigate("/wave-catcher");
        break;
      case "soundmaze":
        navigate("/sound-maze");
        break;
      case "soundquiz":
        navigate("/sound-quiz");
        break;
      default:
        toast({
          title: "Ошибка",
          description: "Игра недоступна",
          variant: "destructive",
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900 touch-manipulation">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Физика звука
          </h1>
          <p className="text-lg text-gray-300">
            Изучайте физику звука через увлекательные игры
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <GameCard
              title="Wave Catcher"
              description="Поймайте инфразвуковые волны и избегайте обычных звуковых волн"
              icon={<AudioWaveform className="w-12 h-12" />}
              onClick={() => handleGameSelect("wavecatcher")}
              className="touch-manipulation active:scale-95 transition-transform"
            />
            
            <GameCard
              title="Звуковой лабиринт"
              description="Пройдите лабиринт, используя звуковые волны для навигации"
              icon={<Box className="w-12 h-12" />}
              onClick={() => handleGameSelect("soundmaze")}
              className="touch-manipulation active:scale-95 transition-transform"
            />
            
            <GameCard
              title="Звуковая викторина"
              description="Проверьте свои знания о физике звука в увлекательной викторине"
              icon={<BrainCircuit className="w-12 h-12" />}
              onClick={() => handleGameSelect("soundquiz")}
              className="touch-manipulation active:scale-95 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}