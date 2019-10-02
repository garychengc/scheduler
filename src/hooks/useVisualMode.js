import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);
  const mode = history[history.length - 1];

  function transition(newMode, replace = false) {
    if (!replace) {
      setHistory(prev => [...prev, newMode]);
    }
  }

  function back() {
    setHistory(prev => prev.slice(0, history.length - 1));
  }

  return { mode, transition, back };
}
