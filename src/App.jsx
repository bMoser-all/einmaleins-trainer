import React, { useState, useEffect } from "react";

// Konfiguration: Anzahl Aufgaben und Punktesystem
const TOTAL_TASKS = 10;
const scoring = [
  { max: 5, points: 10 },
  { max: 8, points: 5 },
  { max: 12, points: 3 },
  { max: Infinity, points: 2 },
];

export default function App() {
  const [task, setTask] = useState(generateTask());
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(1);
  const [finished, setFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [lastDuration, setLastDuration] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  function generateTask() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b };
  }

  function checkAnswer() {
    const duration = (Date.now() - startTime) / 1000;
    const correct = task.a * task.b;
    const numeric = parseInt(answer, 10);

    if (!Number.isNaN(numeric) && numeric === correct) {
      const rule = scoring.find((r) => duration <= r.max);
      setScore((s) => s + (rule ? rule.points : 0));
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((w) => w + 1);
    }

    setLastDuration(duration);
    setTotalTime((t) => t + duration);

    if (count >= TOTAL_TASKS) {
      setFinished(true);
      setAnswer("");
    } else {
      setCount((c) => c + 1);
      setTask(generateTask());
      setAnswer("");
      setStartTime(Date.now());
    }
  }

  function handleDigit(d) {
    setAnswer((a) => (a === "0" ? d : a + d));
  }

  function handleBackspace() {
    setAnswer((a) => a.slice(0, -1));
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (finished) return;
      if (e.key >= "0" && e.key <= "9") {
        setAnswer((a) => (a === "0" ? e.key : a + e.key));
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        checkAnswer();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finished, startTime, answer, task, count]);

  if (finished) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 min-h-0">
          <div className="text-[8vw] sm:text-[6rem] leading-tight font-extrabold mb-4">
            Finale Punktzahl: <span className="text-indigo-600">{score} Punkte</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-700 mt-3">
            Deine Zeit (letzte Antwort): <span className="font-mono">{lastDuration.toFixed(2)}s</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-600 mt-2">
            Gesamtdauer: <span className="font-mono">{totalTime.toFixed(2)}s</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-700 mt-4">
            Richtige Antworten: <span className="font-mono">{correctCount}</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-700 mt-1">
            Falsche Antworten: <span className="font-mono">{wrongCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 p-3 sm:p-6 flex">
      <div className="flex flex-col w-full h-full max-w-3xl mx-auto bg-white/90 dark:bg-gray-900/80 rounded-none sm:rounded-2xl p-4 sm:p-6 shadow-lg min-h-0">
        {/* Header: größer und deutlich hellblau (auch im Dark-Mode) */}
        <div className="flex-none">
          <div className="text-sky-400 dark:text-sky-300 font-semibold tracking-tight
                          text-[clamp(18px,6vw,30px)] sm:text-[1.25rem]">
            Aufgabe {count}/{TOTAL_TASKS}
          </div>
        </div>

        {/* Frage */}
        <div className="flex-none mt-2">
          <div className="text-center">
            <div className="text-[8vw] sm:text-[3.25rem] font-extrabold leading-tight text-gray-800 dark:text-white">
              {task.a} × {task.b}
            </div>
          </div>
        </div>

        {/* Eingabe: größer auf Smartphones */}
        <div className="flex-none mt-3 flex justify-center">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
            className="w-[86%] sm:w-64 p-4 sm:p-6 text-center text-[clamp(20px,9vw,44px)] font-mono rounded-lg
                       bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Antwort eingeben"
            placeholder="?"
          />
        </div>

        {/* Keypad: größere Mindestgröße und größere Schrift auf Mobilgeräten */}
        <div className="flex-1 min-h-0 mt-3">
          <div className="h-full grid grid-cols-3 gap-3 auto-rows-fr">
            {[7,8,9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDigit(n.toString())}
                className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(20px,9vw,40px)] font-bold rounded-lg
                           bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md active:scale-95"
              >
                {n}
              </button>
            ))}

            {[4,5,6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDigit(n.toString())}
                className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(20px,9vw,40px)] font-bold rounded-lg
                           bg-gradient-to-br from-sky-400 to-sky-500 text-white shadow-md active:scale-95"
              >
                {n}
              </button>
            ))}

            {[1,2,3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDigit(n.toString())}
                className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(20px,9vw,40px)] font-bold rounded-lg
                           bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md active:scale-95"
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleDigit("0")}
              className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(20px,9vw,40px)] font-bold rounded-lg
                         bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md active:scale-95"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(18px,7vw,30px)] font-semibold rounded-lg
                         bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md active:scale-95"
              aria-label="Löschen"
            >
              ⌫
            </button>

            <button
              type="button"
              onClick={checkAnswer}
              className="w-full h-full min-h-[88px] sm:min-h-[110px] text-[clamp(20px,9vw,40px)] font-bold rounded-lg
                         bg-gradient-to-br from-green-600 to-green-700 text-white shadow-md active:scale-95"
            >
              OK
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none mt-3 text-center text-gray-700 dark:text-gray-300">
          Score: <span className="font-mono">{score}</span>
        </div>
      </div>
    </div>
  );
}
