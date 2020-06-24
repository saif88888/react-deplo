import React, { useState, useEffect } from "react";
import Card from "./components/card";
import Board from "./components/board";
import initializeDeck from "./deck";
import Navbar from "./components/navbar";

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [dimension, setDimension] = useState(400);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    resizeBoard();
    setCards(initializeDeck());
  }, []);

  useEffect(() => {
    preloadImages();
  }, [cards]);

  useEffect(() => {
    const resizeListner = window.addEventListener("resize", resizeBoard);

    return () => window.removeEventListener("resize", resizeListner);
  });
  const handleClick = (id) => {
    setDisabled(true);
    if (flipped.length === 0) {
      setFlipped([id]);
      setDisabled(false);
    } else {
      if (sameCardClicked(id)) return;
      setFlipped([flipped[0], id]);
      if (isMatch(id)) {
        setSolved([...solved, flipped[0], id]);
        resetCards();
      } else {
        setTimeout(resetCards, 500);
      }
    }
  };
  const newGame = () => {
    setSolved([]);
    setCards(initializeDeck());
  };
  const preloadImages = () => {
    cards.map((card) => {
      const src = `/img/${card.type}.png`;

      new Image().src = src;
    });
  };
  const resetCards = () => {
    setFlipped([]);
    setDisabled(false);
  };

  const sameCardClicked = (id) => flipped.includes(id);
  const isMatch = (id) => {
    const clickedCard = cards.find((card) => card.id === id);
    const flippedCard = cards.find((card) => flipped[0] === card.id);
    return flippedCard.type === clickedCard.type;
  };

  const resizeBoard = () => {
    setDimension(
      Math.min(
        document.documentElement.clientwidth,
        document.documentElement.clientHeight
      )
    );
  };
  return (
    <div>
      <h2>Milestone III - Memory Game</h2>
      <Board
        dimension={dimension}
        cards={cards}
        flipped={flipped}
        handleClick={handleClick}
        disabled={disabled}
        solved={solved}
      />
      <Navbar newGame={newGame} />
    </div>
  );
}
