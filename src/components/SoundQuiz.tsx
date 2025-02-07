
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Expanded question set
const allQuestions: Question[] = [
  {
    id: 1,
    text: "Что такое инфразвук?",
    options: [
      "Звук с частотой выше 20 кГц",
      "Звук с частотой ниже 20 Гц",
      "Звук с частотой от 20 Гц до 20 кГц",
      "Звук, который не слышит человек",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    text: "Как распространяется звук?",
    options: [
      "Только по прямой линии",
      "В виде механических волн",
      "Только в вакууме",
      "Только в жидкостях",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "Какая скорость звука в воздухе при нормальных условиях?",
    options: [
      "150 м/с",
      "340 м/с",
      "500 м/с",
      "1000 м/с",
    ],
    correctAnswer: 1,
  },
];

export function SoundQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Load high score
    const savedHighScore = localStorage.getItem('soundquiz_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    // Shuffle questions
    const shuffled = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuestions(shuffled);
  }, []);

  const playSound = (type: 'correct' | 'wrong') => {
    if (!soundEnabled) return;
    
    const sounds = {
      correct: new Audio('/sounds/correct.mp3'),
      wrong: new Audio('/sounds/wrong.mp3')
    };
    
    sounds[type].play().catch(console.error);
  };

  const handleAnswer = (selectedAnswer: number) => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      playSound('correct');
      setScore(prev => prev + 100);
      toast({
        title: "Правильно!",
        description: "+100 очков",
      });
    } else {
      playSound('wrong');
      toast({
        title: "Неправильно!",
        description: "Попробуйте еще раз",
        variant: "destructive",
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const finalScore = score + (correct ? 100 : 0);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('soundquiz_highscore', finalScore.toString());
        toast({
          title: "Новый рекорд!",
          description: `Поздравляем! Ваш новый рекорд: ${finalScore}`,
        });
      } else {
        toast({
          title: "Игра окончена!",
          description: `Ваш итоговый счет: ${finalScore}. Рекорд: ${highScore}`,
        });
      }
      setGameOver(true);
    }
  };

  const resetGame = () => {
    // Shuffle questions again
    const shuffled = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Звуковая викторина</h1>
        <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
          <div className="bg-primary/10 rounded-lg px-4 py-2">
            <p className="text-xl">Счет: {score}</p>
          </div>
          <div className="bg-primary/10 rounded-lg px-4 py-2">
            <p className="text-xl">Рекорд: {highScore}</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-2">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </div>

      {!gameOver && questions.length > 0 ? (
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-2xl font-semibold text-center mb-8">
            {questions[currentQuestion].text}
          </div>
          
          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                className="p-6 text-lg active:scale-95 transition-transform touch-manipulation"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Игра окончена!</h2>
          <p className="text-xl mb-8">Итоговый счет: {score}</p>
          <Button
            onClick={resetGame}
            className="text-lg p-6 active:scale-95 transition-transform touch-manipulation"
          >
            Играть снова
          </Button>
        </div>
      )}
    </div>
  );
}
