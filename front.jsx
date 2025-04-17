import React from "react";
import ReactDOM from "react-dom";
import MemoryGame from "./MemoryGame";
import "./index.css"; // Tailwind or basic CSS

ReactDOM.render(
  <React.StrictMode>
    <MemoryGame />
  </React.StrictMode>,
  document.getElementById("root")
);
