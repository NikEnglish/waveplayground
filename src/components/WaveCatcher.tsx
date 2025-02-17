
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Wave {
  id: number;
  frequency: number;
  x: number;
  y: number;
  caught: boolean;
}

export function WaveCatcher() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);

  // Load high score on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('wavecatcher_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Update high score when game ends
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('wavecatcher_highscore', score.toString());
      toast({
        title: "Новый рекорд!",
        description: `Ваш новый рекорд: ${score}`,
      });
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    if (!gameOver && lives > 0) {
      const interval = setInterval(() => {
        setWaves((currentWaves) => {
          // Remove waves that are off screen or caught
          const filteredWaves = currentWaves
            .filter((wave) => wave.y < 100 && !wave.caught)
            .map((wave) => ({
              ...wave,
              y: wave.y + 1,
            }));

          // Add new wave if less than 3 waves on screen
          if (filteredWaves.length < 3) {
            return [
              ...filteredWaves,
              {
                id: Date.now(),
                frequency: Math.floor(Math.random() * 40),
                x: Math.random() * 80 + 10,
                y: 0,
                caught: false,
              },
            ];
          }

          return filteredWaves;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameOver, lives]);

  useEffect(() => {
    // Check if wave reached the end
    waves.forEach((wave) => {
      if (wave.y >= 90 && !wave.caught) {
        if (wave.frequency < 20) {
          // Missed an infrasound wave
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives === 0) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('wavecatcher_highscore', score.toString());
                toast({
                  title: "Новый рекорд!",
                  description: `Ваш новый рекорд: ${score}`,
                });
              } else {
                toast({
                  title: "Игра окончена!",
                  description: `Ваш счет: ${score}. Рекорд: ${highScore}`,
                });
              }
            }
            return newLives;
          });
        }
        setWaves((prev) =>
          prev.map((w) =>
            w.id === wave.id ? { ...w, caught: true } : w
          )
        );
      }
    });
  }, [waves, score, highScore]);

  const catchWave = (wave: Wave) => {
    if (wave.caught) return;

    if (wave.frequency < 20) {
      // Caught infrasound wave
      setScore((prev) => prev + 100);
      toast({
        title: "Отлично!",
        description: "Вы поймали инфразвуковую волну!",
      });
    } else {
      // Caught wrong wave
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('wavecatcher_highscore', score.toString());
            toast({
              title: "Новый рекорд!",
              description: `Ваш новый рекорд: ${score}`,
            });
          } else {
            toast({
              title: "Игра окончена!",
              description: `Ваш счет: ${score}. Рекорд: ${highScore}`,
            });
          }
        }
        return newLives;
      });
      toast({
        title: "Упс!",
        description: "Это не инфразвуковая волна!",
        variant: "destructive",
      });
    }

    setWaves((prev) =>
      prev.map((w) =>
        w.id === wave.id ? { ...w, caught: true } : w
      )
    );
  };

  const resetGame = () => {
    setWaves([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 touch-manipulation">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Wave Catcher</h1>
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <div className="bg-primary/10 rounded-lg px-4 py-2">
            <p className="text-xl mb-2">Счет: {score}</p>
          </div>
          <div className="bg-primary/10 rounded-lg px-4 py-2">
            <p className="text-xl mb-2">Рекорд: {highScore}</p>
          </div>
          <div className="bg-primary/10 rounded-lg px-4 py-2">
            <p className="text-xl">Жизни: {"❤️".repeat(lives)}</p>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-2xl h-96 border-2 border-primary rounded-lg overflow-hidden touch-manipulation">
        {waves.map((wave) => (
          <div
            key={wave.id}
            className={`absolute cursor-pointer transition-all duration-200 
              ${wave.caught ? "opacity-50" : "animate-pulse"}
              ${wave.frequency < 20 ? "text-blue-500" : "text-red-500"}
              touch-manipulation active:scale-95`}
            style={{
              left: `${wave.x}%`,
              top: `${wave.y}%`,
              transform: "translate(-50%, -50%)",
              padding: "20px",
            }}
            onClick={() => catchWave(wave)}
          >
            <div className="text-center">
              <div className="text-3xl">〰️</div>
              <div className="text-lg font-bold">{wave.frequency}Hz</div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-8">
          <Button 
            onClick={resetGame}
            className="text-lg py-6 px-8 active:scale-95 transition-transform"
          >
            Играть снова
          </Button>
        </div>
      )}
    </div>
  );
}
