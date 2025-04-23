import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Számláló Játék</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Növel</button>
      <button onClick={() => setCount(count - 1)}>Csökkent</button>
      <button onClick={() => setCount(0)}>Visszaállít</button>
    </div>
  );
}
