import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  emoji: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Сколько ног у паука?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    emoji: "🕷️"
  },
  {
    id: 2,
    question: "Какого цвета небо в ясный день?",
    options: ["Зелёное", "Голубое", "Красное", "Жёлтое"],
    correctAnswer: 1,
    emoji: "☀️"
  },
  {
    id: 3,
    question: "Сколько будет 5 + 3?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 1,
    emoji: "🔢"
  },
  {
    id: 4,
    question: "Что говорит корова?",
    options: ["Гав-гав", "Мяу", "Му-у-у", "Кря-кря"],
    correctAnswer: 2,
    emoji: "🐮"
  },
  {
    id: 5,
    question: "Какое время года самое холодное?",
    options: ["Лето", "Осень", "Весна", "Зима"],
    correctAnswer: 3,
    emoji: "❄️"
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{name: string; score: number}[]>([
    { name: "Алиса", score: 480 },
    { name: "Максим", score: 450 },
    { name: "София", score: 420 }
  ]);

  useEffect(() => {
    if (!gameStarted || showResult || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, showResult]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = Math.floor((timeLeft / 15) * 100);
      setScore(score + points);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = () => {
    setGameStarted(false);
    const finalScore = score + (isCorrect ? Math.floor((timeLeft / 15) * 100) : 0);
    const newLeaderboard = [...leaderboard, { name: "Ты", score: finalScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(newLeaderboard);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameStarted(true);
  };

  const getButtonColor = (index: number) => {
    if (!showResult) return 'bg-white hover:bg-gradient-to-r hover:from-[hsl(var(--quiz-pink))] hover:to-[hsl(var(--quiz-orange))] hover:text-white';
    if (index === questions[currentQuestion].correctAnswer) return 'bg-green-400 text-white';
    if (index === selectedAnswer) return 'bg-red-400 text-white';
    return 'bg-white opacity-50';
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--quiz-pink))] via-[hsl(var(--quiz-purple))] to-[hsl(var(--quiz-teal))] flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full p-8 md:p-12 bg-white/95 backdrop-blur animate-scale-in shadow-2xl">
          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <img 
                src="https://cdn.poehali.dev/projects/b8f74db4-e54e-4811-b6f3-2a727e3247ef/files/55c77b99-89e5-4586-8481-2c39ee5fa62d.jpg"
                alt="Quiz mascot"
                className="w-48 h-48 mx-auto animate-bounce-soft rounded-full shadow-xl"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl text-[hsl(var(--quiz-purple))] animate-fade-in">
                Детская Викторина! 🎯
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-semibold">
                Проверь свои знания и набери больше всех очков!
              </p>
            </div>

            <div className="bg-gradient-to-r from-[hsl(var(--quiz-yellow))]/20 to-[hsl(var(--quiz-teal))]/20 rounded-2xl p-6 space-y-3">
              <h3 className="text-2xl font-bold text-[hsl(var(--quiz-purple))]">Правила игры:</h3>
              <ul className="text-left space-y-2 max-w-md mx-auto text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-3xl">⏱️</span>
                  <span>15 секунд на каждый вопрос</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <span>Чем быстрее ответ, тем больше очков</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <span>Попади в таблицу лидеров!</span>
                </li>
              </ul>
            </div>

            {leaderboard.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 animate-slide-up">
                <h3 className="text-2xl font-bold text-[hsl(var(--quiz-purple))] mb-4 flex items-center justify-center gap-2">
                  <Icon name="Trophy" size={32} className="text-yellow-600" />
                  Таблица лидеров
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        player.name === "Ты" ? 'bg-gradient-to-r from-yellow-300 to-orange-300 font-bold animate-wiggle' : 'bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                        </span>
                        <span className="text-lg">{player.name}</span>
                      </div>
                      <span className="text-xl font-bold text-[hsl(var(--quiz-purple))]">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={restartQuiz}
              size="lg"
              className="text-2xl px-12 py-8 bg-gradient-to-r from-[hsl(var(--quiz-pink))] to-[hsl(var(--quiz-orange))] hover:scale-110 transition-transform shadow-xl text-white font-bold rounded-2xl"
            >
              {score > 0 ? '🔄 Играть ещё!' : '🚀 Начать игру!'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--quiz-pink))] via-[hsl(var(--quiz-purple))] to-[hsl(var(--quiz-teal))] flex items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.3}s`
              }}
            >
              {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <Card className="max-w-3xl w-full p-6 md:p-10 bg-white/95 backdrop-blur animate-scale-in shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="Brain" size={32} className="text-[hsl(var(--quiz-purple))]" />
              <span className="text-2xl font-bold text-[hsl(var(--quiz-purple))]">
                Очки: {score}
              </span>
            </div>
            <div className={`text-4xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-bounce' : 'text-[hsl(var(--quiz-teal))]'}`}>
              ⏱️ {timeLeft}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="bg-gradient-to-r from-[hsl(var(--quiz-yellow))]/30 to-[hsl(var(--quiz-teal))]/30 rounded-2xl p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-soft">{question.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--quiz-purple))]">
              {question.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`${getButtonColor(index)} text-xl py-8 px-6 border-4 border-[hsl(var(--quiz-purple))]/20 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg rounded-2xl`}
              >
                {option}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className={`text-center p-6 rounded-2xl animate-scale-in ${
              isCorrect 
                ? 'bg-gradient-to-r from-green-200 to-green-300' 
                : 'bg-gradient-to-r from-red-200 to-red-300'
            }`}>
              <div className="text-5xl mb-2">
                {isCorrect ? '🎉 Правильно!' : '😅 Не угадал!'}
              </div>
              <p className="text-xl font-bold text-gray-800">
                {isCorrect 
                  ? `+${Math.floor((timeLeft / 15) * 100)} очков!` 
                  : `Правильный ответ: ${question.options[question.correctAnswer]}`
                }
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
