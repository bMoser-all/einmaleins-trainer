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

  // Aufgabe generieren (Zahlen 1-10)
  function generateTask() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b };
  }

  // Antwort prüfen und Punkte vergeben
  function checkAnswer() {
    const duration = (Date.now() - startTime) / 1000;
    const correct = task.a * task.b;

    if (parseInt(answer) === correct) {
      const rule = scoring.find((r) => duration <= r.max);
      setScore((s) => s + (rule ? rule.points : 0));
    }

    // Zeiten aktualisieren
    setLastDuration(duration);
    setTotalTime((t) => t + duration);

    if (count >= TOTAL_TASKS) {
      setFinished(true);
    } else {
      setCount((c) => c + 1);
      setTask(generateTask());
      setAnswer("");
      setStartTime(Date.now());
    }
  }

  function handleDigit(d) {
    // Verhindere führende Nullen
    setAnswer((a) => (a === "0" ? d : a + d));
  }

  function handleBackspace() {
    setAnswer((a) => a.slice(0, -1));
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (finished) return;
      if (e.key >= "0" && e.key <= "9") {
        // append digit
        setAnswer((a) => (a === "0" ? e.key : a + e.key));
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        checkAnswer();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finished, startTime, answer, task, count]); // dependencies to access latest state

  if (finished) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
          <div className="text-[8vw] sm:text-[6rem] leading-tight font-extrabold mb-4">
            Finale Punktzahl: <span className="text-indigo-600">{score} Punkte</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-700 mt-3">
            Deine Zeit (letzte Antwort): <span className="font-mono">{lastDuration.toFixed(2)}s</span>
          </div>

          <div className="text-[4.5vw] sm:text-2xl text-gray-600 mt-2">
            Gesamtdauer: <span className="font-mono">{totalTime.toFixed(2)}s</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 p-3 sm:p-6">
      <div className="w-full h-full sm:h-auto bg-white/90 dark:bg-gray-900/80
                      rounded-none sm:rounded-2xl sm:max-w-sm mx-auto p-4 sm:p-6
                      shadow-lg flex flex-col justify-between">
        {/* Zeile 1: Aufgabe 1/10 */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Aufgabe {count}/{TOTAL_TASKS}
        </div>

        {/* großer spacer */}
        <div className="h-2" />

        {/* Zeile 3: große Aufgabe */}
        <div className="text-center flex-0">
          <div className="text-[6.5vw] sm:text-5xl font-extrabold leading-none text-gray-800 dark:text-white">
            {task.a} × {task.b}
          </div>
        </div>

        <div className="h-4" />

        {/* Eingabefeld */}
        <div className="flex justify-center">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
            className="w-[86%] sm:w-48 p-4 text-center text-[5vw] sm:text-2xl font-mono rounded-lg
                       bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Antwort eingeben"
            placeholder="?"
          />
        </div>

        <div className="h-4" />

        {/* Ziffernblock */}
        <div className="grid grid-cols-3 gap-3">
          {[7,8,9].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleDigit(n.toString())}
              className="py-[4.5vw] sm:py-4 text-[5.5vw] sm:text-2xl font-bold rounded-lg
                         bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md active:scale-95"
            >
              {n}
            </button>
          ))}

          {[4,5,6].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleDigit(n.toString())}
              className="py-[4.5vw] sm:py-4 text-[5.5vw] sm:text-2xl font-bold rounded-lg
                         bg-gradient-to-br from-sky-400 to-sky-500 text-white shadow-md active:scale-95"
            >
              {n}
            </button>
          ))}

          {[1,2,3].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleDigit(n.toString())}
              className="py-[4.5vw] sm:py-4 text-[5.5vw] sm:text-2xl font-bold rounded-lg
                         bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md active:scale-95"
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="py-[4.5vw] sm:py-4 text-[5.5vw] sm:text-2xl font-bold rounded-lg
                       bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md active:scale-95"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="py-[4.5vw] sm:py-4 text-[5vw] sm:text-xl font-semibold rounded-lg
                       bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md active:scale-95"
            aria-label="Löschen"
          >
            ⌫
          </button>

          <button
            type="button"
            onClick={checkAnswer}
            className="py-[4.5vw] sm:py-4 text-[5.5vw] sm:text-2xl font-bold rounded-lg
                       bg-gradient-to-br from-green-600 to-green-700 text-white shadow-md active:scale-95"
          >
            OK
          </button>
        </div>

        <div className="h-3" />

        <div className="text-center text-gray-700 dark:text-gray-300">
          Score: <span className="font-mono">{score}</span>
        </div>
      </div>
    </div>
  );
}
