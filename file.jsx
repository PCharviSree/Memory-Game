import React, { useEffect, useState } from "react";

const emojiList = ['🍕', '🍔', '🍟', '🌮', '🍩', '🍿', '🥐', '🥨'];

function shuffleArray(array) {
  const newArr = [...array, ...array]; // duplicate emojis for pairs
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

  useEffect(() => {
    setCards(shuffleArray(emojiList));
  }, []);

  const handleCardClick = (cardIndex) => {
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
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
      } else {
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
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mt-4">🧠 Memory Game</h1>
      <button
        onClick={resetGame}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        🔁 Reset Game
      </button>
      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-20 h-20 flex items-center justify-center text-3xl border-2 rounded-lg shadow-md cursor-pointer transition-all ${
              card.flipped || card.matched ? "bg-white" : "bg-gray-400"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
}
