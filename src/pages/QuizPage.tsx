import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS, getQuizResult } from '@/lib/quiz-data';
import NourLogo from '@/components/NourLogo';

const ANSWER_COLORS = [
  'bg-quiz-red hover:brightness-110',
  'bg-quiz-blue hover:brightness-110',
  'bg-quiz-yellow hover:brightness-110',
  'bg-quiz-green hover:brightness-110',
];
const ANSWER_LABELS = ['A', 'B', 'C', 'D'];
const ANSWER_SHAPES = ['▲', '◆', '●', '■'];

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pin = searchParams.get('pin') || '';
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const question = QUIZ_QUESTIONS[currentQ];
  const prevSection = currentQ > 0 ? QUIZ_QUESTIONS[currentQ - 1].section : '';
  const isNewSection = question.section !== prevSection;

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null || showResult) return;
    setSelected(idx);
    setShowResult(true);
    // Score: A=0, B=1, C=2, D=3
    setTotalScore((s) => s + idx);
    setAnsweredCount((c) => c + 1);
  }, [selected, showResult]);

  // Timer
  useEffect(() => {
    if (showResult || gameOver) return;
    if (timeLeft <= 0) {
      // Time out = no answer, move on (no points added)
      setShowResult(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult, gameOver]);

  const nextQuestion = () => {
    if (currentQ + 1 >= QUIZ_QUESTIONS.length) {
      setGameOver(true);
      const playerData = JSON.parse(localStorage.getItem('playerData') || '{}');
      playerData.score = totalScore;
      localStorage.setItem('playerData', JSON.stringify(playerData));
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(15);
  };

  const goHome = () => {
    localStorage.removeItem('quizStarted_' + pin);
    navigate('/');
  };

  // Game over - show results
  if (gameOver) {
    const result = getQuizResult(totalScore);
    return (
      <div className="min-h-screen gradient-lobby flex items-center justify-center p-4">
        <div className="bg-black/30 backdrop-blur rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center">
          <div className="text-7xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Your Score: {totalScore} / 33</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-nour-yellow mb-4">{result.label}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-lg mx-auto">{result.description}</p>

          <div className="bg-black/20 rounded-2xl p-6 text-left mb-8">
            <h3 className="text-xl font-bold mb-4 text-nour-lime">💡 Recommended Actions:</h3>
            <ul className="space-y-3">
              {result.solutions.map((sol, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-nour-green mt-1">✔</span>
                  <span className="opacity-90">{sol}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Score breakdown */}
          <div className="bg-black/20 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-3">Score Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">✅</div>
                <div className="font-bold">0–8</div>
                <div className="opacity-70 text-xs">Healthy</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">⚠️</div>
                <div className="font-bold">9–16</div>
                <div className="opacity-70 text-xs">Mild Risk</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">⚠️</div>
                <div className="font-bold">17–24</div>
                <div className="opacity-70 text-xs">Moderate</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">🚨</div>
                <div className="font-bold">25–33</div>
                <div className="opacity-70 text-xs">High Exposure</div>
              </div>
            </div>
          </div>

          <button
            onClick={goHome}
            className="bg-gradient-to-b from-primary to-nour-lime-dark text-primary-foreground font-black text-xl py-4 px-12 rounded-full shadow-[var(--shadow-btn-start)] hover:translate-y-[-3px] hover:shadow-[var(--shadow-btn-start-hover)] active:translate-y-[5px] active:shadow-[var(--shadow-btn-start-active)] transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/30">
        <NourLogo size="sm" />
        <div className="flex gap-6 items-center font-bold text-lg">
          <span>Q {currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
          <span className="text-nour-yellow">Score: {totalScore}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Section indicator */}
        {isNewSection && (
          <div className="text-center mb-4 animate-slide-in">
            <span className="inline-block bg-white/15 backdrop-blur px-6 py-2 rounded-full text-sm font-bold">
              {question.sectionEmoji} Section: {question.section}
            </span>
          </div>
        )}

        {/* Timer bar */}
        <div className="w-full bg-black/30 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / question.timeLimit) * 100}%`,
              background: timeLeft <= 5 ? 'hsl(0 72% 51%)' : timeLeft <= 10 ? 'hsl(45 93% 47%)' : 'hsl(68 100% 50%)',
            }}
          />
        </div>

        {/* Timer number */}
        <div className={`text-center mb-6 ${timeLeft <= 5 ? 'animate-timer-pulse' : ''}`}>
          <span className={`text-5xl font-black ${timeLeft <= 5 ? 'text-quiz-red' : 'text-nour-lime'}`}>
            {timeLeft}
          </span>
        </div>

        {/* Question */}
        <div className="bg-black/30 rounded-2xl p-6 md:p-8 mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold">{question.question}</h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {question.answers.map((answer, idx) => {
            const isSelected = idx === selected;
            let extraClass = '';
            if (showResult) {
              if (isSelected) extraClass = 'ring-4 ring-white scale-[1.02]';
              else extraClass = 'opacity-50';
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`${ANSWER_COLORS[idx]} ${extraClass} text-foreground font-bold text-base md:text-lg p-5 md:p-6 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 text-left`}
              >
                <span className="text-2xl opacity-70">{ANSWER_SHAPES[idx]}</span>
                <span className="flex-1">
                  <span className="font-black mr-2">{ANSWER_LABELS[idx]}.</span>
                  {answer}
                </span>
                {showResult && isSelected && <span className="ml-auto text-2xl">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {showResult && (
          <div className="text-center mt-8 animate-slide-in">
            <div className="mb-4 text-lg font-bold">
              {selected !== null ? (
                <span className="text-nour-green">Answer recorded! (+{selected} points)</span>
              ) : (
                <span className="text-nour-yellow">⏰ Time's up! No answer recorded.</span>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-b from-primary to-nour-lime-dark text-primary-foreground font-black text-xl py-4 px-12 rounded-full shadow-[var(--shadow-btn-start)] hover:translate-y-[-3px] hover:shadow-[var(--shadow-btn-start-hover)] active:translate-y-[5px] active:shadow-[var(--shadow-btn-start-active)] transition-all cursor-pointer"
            >
              {currentQ + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'See Results'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
