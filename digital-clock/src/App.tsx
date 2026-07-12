import { useState, ChangeEvent } from "react";

function App() {
  const [hours, setHours] = useState<string | number>("");
  const [minute, setMinute] = useState<string | number>("");
  const [second, setSecond] = useState<string | number>("");
  const [ampm, setAMPM] = useState<string>("");

  const calculateTime = (): void => {
    const now = new Date();

    const hours24: number = now.getHours();
    const hours12: number = hours24 % 12 || 12;
    let minutes: number | string = now.getMinutes();
    let seconds: number | string = now.getSeconds();
    const AmPm:string = hours24 >= 12 ? 'PM' : 'AM';

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    

    setHours(hours12);
    setMinute(minutes);
    setSecond(seconds);
    setAMPM(AmPm);

  }

  setInterval(calculateTime, 1000);

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {setHours(e.target.value)};
  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {setHours(e.target.value)};
  const handleSecondChange = (e: ChangeEvent<HTMLInputElement>) => {setHours(e.target.value)};

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 gap-8">
      <h1 className="text-3xl font-semibold tracking-wider text-zinc-400">
        Digital Clock
      </h1>

      {/* Increased max-w-lg to safely fit 4 columns on small screens */}
      <div className="w-full max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-3 sm:gap-4 shadow-2xl">
        {/* Hours Block */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder={hours.toString()}
            value={hours}
            onChange={handleHourChange}
            readOnly
            className="w-16 sm:w-20 h-16 text-center text-2xl font-mono bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 focus:outline-none focus:border-zinc-700"
          />
          <span className="text-[10px] sm:text-xs font-medium tracking-wide text-zinc-500 uppercase">Hours</span>
        </div>

        <span className="text-xl sm:text-2xl font-mono text-zinc-500 animate-pulse pb-6">:</span>

        {/* Minutes Block */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder={minute.toString()}
            value={minute}
            onChange={handleMinuteChange}
            readOnly
            className="w-16 sm:w-20 h-16 text-center text-2xl font-mono bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 focus:outline-none focus:border-zinc-700"
          />
          <span className="text-[10px] sm:text-xs font-medium tracking-wide text-zinc-500 uppercase">Minute</span>
        </div>

        <span className="text-xl sm:text-2xl font-mono text-zinc-500 animate-pulse pb-6">:</span>

        {/* Seconds Block */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder={second.toString()}
            value={second}
            onChange={handleSecondChange}
            readOnly
            className="w-16 sm:w-20 h-16 text-center text-2xl font-mono bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 focus:outline-none focus:border-zinc-700"
          />
          <span className="text-[10px] sm:text-xs font-medium tracking-wide text-zinc-500 uppercase">Second</span>
        </div>

        {/* Space separation instead of a colon for AM/PM */}
        <div className="w-1 sm:w-2 pb-6"></div>

        {/* AMPM Block */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder={ampm}
            value={ampm}
            onChange={(e) => setAMPM(e.target.value)}
            readOnly
            className="w-16 sm:w-20 h-16 text-center text-2xl font-mono bg-zinc-800 border border-zinc-700 rounded-lg text-emerald-400 focus:outline-none focus:border-zinc-700 uppercase"
          />
          <span className="text-[10px] sm:text-xs font-medium tracking-wide text-zinc-500 uppercase">AM/PM</span>
        </div>
      </div>
    </div>
  );
}

export default App;
