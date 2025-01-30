import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Cell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
}

export function SoundMaze() {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const mazeSize = 8;

  const generateMaze = () => {
    const newMaze: Cell[][] = Array(mazeSize).fill(null).map((_, y) =>
      Array(mazeSize).fill(null).map((_, x) => ({
        x,
        y,
        isWall: Math.random() < 0.3,
        isPath: false,
        isVisited: false,
      }))
    );
    
    // Ensure start and end are clear
    newMaze[0][0].isWall = false;
    newMaze[mazeSize - 1][mazeSize - 1].isWall = false;
    
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    generateMaze();
  }, [level]);

  const movePlayer = (direction: { x: number; y: number }) => {
    const newPosition = {
      x: playerPosition.x + direction.x,
      y: playerPosition.y + direction.y,
    };

    if (
      newPosition.x >= 0 &&
      newPosition.x < mazeSize &&
      newPosition.y >= 0 &&
      newPosition.y < mazeSize &&
      !maze[newPosition.y][newPosition.x].isWall
    ) {
      setPlayerPosition(newPosition);
      
      if (newPosition.x === mazeSize - 1 && newPosition.y === mazeSize - 1) {
        toast({
          title: "Уровень пройден!",
          description: `Вы получили ${100 * level} очков!`,
        });
        setScore(prev => prev + 100 * level);
        setLevel(prev => prev + 1);
      }
    } else {
      toast({
        title: "Упс!",
        description: "Там стена!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Звуковой лабиринт</h1>
        <p className="text-xl mb-2">Уровень: {level}</p>
        <p className="text-xl">Счет: {score}</p>
      </div>

      <div className="grid gap-1 p-4 bg-accent/20 rounded-lg">
        {maze.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-10 h-10 rounded-md transition-colors duration-200 ${
                  cell.isWall
                    ? "bg-primary/80"
                    : playerPosition.x === x && playerPosition.y === y
                    ? "bg-green-500"
                    : x === mazeSize - 1 && y === mazeSize - 1
                    ? "bg-blue-500"
                    : "bg-accent"
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        <Button
          className="col-start-2 p-6 text-lg active:scale-95 transition-transform touch-manipulation"
          onClick={() => movePlayer({ x: 0, y: -1 })}
        >
          ↑
        </Button>
        <Button
          className="p-6 text-lg active:scale-95 transition-transform touch-manipulation"
          onClick={() => movePlayer({ x: -1, y: 0 })}
        >
          ←
        </Button>
        <Button
          className="p-6 text-lg active:scale-95 transition-transform touch-manipulation"
          onClick={() => movePlayer({ x: 0, y: 1 })}
        >
          ↓
        </Button>
        <Button
          className="p-6 text-lg active:scale-95 transition-transform touch-manipulation"
          onClick={() => movePlayer({ x: 1, y: 0 })}
        >
          →
        </Button>
      </div>
    </div>
  );
}