import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

const emojiList = ['🍕', '🍔', '🍟', '🌮', '🍩', '🍿', '🥐', '🥨'];

const COMMENTS = {
  goodMatch: ["Great match! 🎯", "You're on fire! 🔥", "Perfect pair! ✨"],
  wrongMatch: ["Oops! Try again! 🤔", "Almost had it! 💫", "Keep going! 🌟"],
  gameEnd: ["Amazing victory! 🏆", "You're a memory master! 👑", "Spectacular finish! 🌈"]
};

function shuffleArray(array) {
  const newArr = [...array, ...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [commentary, setCommentary] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    setCards(shuffleArray(emojiList));
  }, []);

  useEffect(() => {
    let timer;
    if (isGameActive && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, gameComplete]);

  const getRandomComment = (type) => {
    const comments = COMMENTS[type];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const handleCardClick = (cardIndex) => {
    if (!isGameActive) setIsGameActive(true);
    
    if (
      cards[cardIndex].flipped ||
      flippedCards.length === 2 ||
      cards[cardIndex].matched
    ) return;

    const newCards = [...cards];
    newCards[cardIndex].flipped = true;

    const newFlipped = [...flippedCards, cardIndex];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        const timeBonus = Math.max(50 - timeElapsed, 0);
        const points = 100 + timeBonus;
        setScore(prev => prev + points);
        setCommentary(getRandomComment("goodMatch"));
        
        setTimeout(() => {
          setFlippedCards([]);
          // Check if all cards are matched
          if (newCards.every(card => card.matched)) {
            setGameComplete(true);
            setShowConfetti(true);
            setIsGameActive(false);
            setCommentary(getRandomComment("gameEnd"));
          }
        }, 500);
      } else {
        setCommentary(getRandomComment("wrongMatch"));
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(shuffleArray(emojiList));
    setFlippedCards([]);
    setScore(0);
    setTimeElapsed(0);
    setIsGameActive(false);
    setShowConfetti(false);
    setCommentary("");
    setGameComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen bg-gray-100 py-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <h1 className="text-4xl font-bold mt-4 text-blue-600">🧠 Memory Game</h1>
      
      <div className="flex gap-8 items-center mb-4">
        <div className="text-xl font-semibold text-purple-600">
          Score: {score}
        </div>
        <div className="text-xl font-semibold text-green-600">
          Time: {timeElapsed}s
        </div>
      </div>

      {commentary && (
        <div className="text-xl font-bold text-orange-500 animate-bounce">
          {commentary}
        </div>
      )}

      <button
        onClick={resetGame}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        🔁 Reset Game
      </button>

      <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-xl">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-24 h-24 flex items-center justify-center text-4xl border-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              card.flipped || card.matched
                ? "bg-white border-green-400"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="text-2xl font-bold text-green-600 mt-4 animate-pulse">
          🎉 Game Complete! Final Score: {score} 🏆
        </div>
      )}
    </div>
  );
} 