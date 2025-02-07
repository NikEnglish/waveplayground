import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Volume2, VolumeX } from "lucide-react";

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
  const [difficulty, setDifficulty] = useState(30); // Wall density percentage
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const mazeSize = 8 + Math.floor(level / 3); // Maze grows with level

  // Sound effects
  const playSound = useCallback((type: 'move' | 'wall' | 'win') => {
    if (!soundEnabled) return;
    
    const sounds = {
      move: new Audio('/sounds/move.mp3'),
      wall: new Audio('/sounds/wall.mp3'),
      win: new Audio('/sounds/win.mp3')
    };
    
    sounds[type].play().catch(console.error);
  }, [soundEnabled]);

  // Generate maze with guaranteed path
  const generateMaze = useCallback(() => {
    const newMaze: Cell[][] = Array(mazeSize).fill(null).map((_, y) =>
      Array(mazeSize).fill(null).map((_, x) => ({
        x,
        y,
        isWall: false,
        isPath: false,
        isVisited: false,
      }))
    );

    // First create a path from start to finish
    let currentX = 0;
    let currentY = 0;
    const target = { x: mazeSize - 1, y: mazeSize - 1 };
    
    while (currentX !== target.x || currentY !== target.y) {
      if (currentX < target.x && Math.random() > 0.5) {
        currentX++;
      } else if (currentY < target.y) {
        currentY++;
      } else {
        currentX++;
      }
      newMaze[currentY][currentX].isPath = true;
    }

    // Then add random walls, but not on the path
    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        if (!newMaze[y][x].isPath && Math.random() < difficulty / 100) {
          newMaze[y][x].isWall = true;
        }
      }
    }
    
    // Ensure start and end are clear
    newMaze[0][0].isWall = false;
    newMaze[mazeSize - 1][mazeSize - 1].isWall = false;
    
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
  }, [mazeSize, difficulty]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('mazehighscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    generateMaze();
  }, [level, generateMaze]);

  const movePlayer = (direction: { x: number; y: number }) => {
    const newPosition = {
      x: playerPosition.x + direction.x,
      y: playerPosition.y + direction.y,
    };

    if (
      newPosition.x >= 0 &&
      newPosition.x < mazeSize &&
      newPosition.y >= 0 &&
      newPosition.y < mazeSize
    ) {
      if (!maze[newPosition.y][newPosition.x].isWall) {
        setPlayerPosition(newPosition);
        playSound('move');
        
        if (newPosition.x === mazeSize - 1 && newPosition.y === mazeSize - 1) {
          const levelScore = 100 * level;
          const newTotalScore = score + levelScore;
          setScore(newTotalScore);
          
          if (newTotalScore > highScore) {
            setHighScore(newTotalScore);
            localStorage.setItem('soundmaze_highscore', newTotalScore.toString());
            toast({
              title: "Новый рекорд!",
              description: `Поздравляем! Ваш новый рекорд: ${newTotalScore}`,
            });
          }
          
          playSound('win');
          toast({
            title: "Уровень пройден!",
            description: `Вы получили ${levelScore} очков!`,
          });
          setLevel(prev => prev + 1);
        }
      } else {
        playSound('wall');
        toast({
          title: "Упс!",
          description: "Там стена!",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Звуковой лабиринт</h1>
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <p className="text-xl">Уровень: {level}</p>
          <p className="text-xl">Счет: {score}</p>
          <p className="text-xl">Рекорд: {highScore}</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Настройки</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Сложность ({difficulty}%)</Label>
                <Slider
                  value={[difficulty]}
                  onValueChange={([value]) => setDifficulty(value)}
                  min={10}
                  max={50}
                  step={5}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Звук</Label>
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-1 p-4 bg-accent/20 rounded-lg mb-8">
        {maze.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-md transition-colors duration-200 ${
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

      <div className="grid grid-cols-3 gap-2 max-w-[200px]">
        <div />
        <Button
          className="p-6 text-lg active:scale-95 transition-transform touch-manipulation"
          onClick={() => movePlayer({ x: 0, y: -1 })}
        >
          ↑
        </Button>
        <div />
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
