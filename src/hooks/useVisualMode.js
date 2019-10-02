import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);
  const mode = history[history.length - 1];

  function transition(mode, replace = false) {
    if (!replace) {
      setHistory(prev => [...prev, mode]);
    } else {
      setHistory(prev => [...prev.slice(0, prev.length - 1), mode]);
    }
  }

  function back() {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, prev.length - 1));
    }
  }

  console.log(history);
  console.log(mode);

  return { mode, transition, back };
}

// export default function useVisualMode(initial) {
//   const [mode, setMode] = useState(initial);
//   const [history, setHistory] = useState([initial]);

//   function transition(newMode, replace = false) {
//     if (!replace) {
//       history.push(newMode);
//     }
//     setMode(newMode);
//   }

//   function back() {
//     if (history.length === 1) {
//       setMode(history[0]);
//     } else {
//       history.pop();
//       setMode(history[history.length - 1]);
//     }
//   }
//   console.log(history);

//   return { mode, transition, back };
// }
