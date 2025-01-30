import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
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

  const handleAnswer = (selectedAnswer: number) => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      setScore(prev => prev + 100);
      toast({
        title: "Правильно!",
        description: "+100 очков",
      });
    } else {
      toast({
        title: "Неправильно!",
        description: "Попробуйте еще раз",
        variant: "destructive",
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameOver(true);
      toast({
        title: "Игра окончена!",
        description: `Ваш итоговый счет: ${score + (correct ? 100 : 0)}`,
      });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Звуковая викторина</h1>
        <p className="text-xl">Счет: {score}</p>
      </div>

      {!gameOver ? (
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