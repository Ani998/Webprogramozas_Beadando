import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");

  const handleClick = (value) => setInput((prev) => prev + value);
  const clear = () => setInput("");
  const calculate = () => {
    try {
      setInput(eval(input).toString()); 
    } catch {
      setInput("Hiba");
    }
  };

  return (
    <div>
      <h1>Számológép</h1>
      <input value={input} readOnly />
      <div>
        {[1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "*", 0, ".", "=", "/"].map((val) => (
          <button key={val} onClick={() => (val === "=" ? calculate() : handleClick(val))}>
            {val}
          </button>
        ))}
        <button onClick={clear}>C</button>
      </div>
    </div>
  );
}
