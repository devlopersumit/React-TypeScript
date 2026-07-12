import { useState, ChangeEvent } from "react"

function App() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBMI] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = (): void => {
    if(!weight.trim() || !height.trim()) {
      setError("please enter your input first");
      setBMI(null);
      return;
    }

    setError("");
    const w:number = parseFloat(weight);
    const h:number = parseFloat(height);

    if(isNaN(w) || isNaN(h) || w === 0 || h === 0) {
      setError("Please enter a valid positive number");
      setBMI(null);
      return;
    }

    const hInMeter: number = h / 100;
    const calculatedBmi: number = w / (hInMeter * hInMeter);
    setBMI(Number(calculatedBmi.toFixed(2)));
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWeight(e.target.value);
  };

    const handleHeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setHeight(e.target.value);
  };

  return (
    <>
   <div className="w-full min-h-screen flex justify-center items-center bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-purple-100/50">
        <div className="w-full max-w-md p-10 bg-linear-to-br from-indigo-50 via-white to-purple-50/70 backdrop-blur-md border border-indigo-100/80 rounded-2xl shadow-xl shadow-indigo-950/5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/10 flex flex-col items-center gap-4.5">
          
          <h1 className="font-bold text-xl text-center mb-2">BMI Calculator</h1>

          {/* Weight Input Box */}
          <div className="relative w-full max-w-xs group">
            <input
              type="text"
              placeholder="Enter your weight..."
              value={weight}
              onChange={handleWeightChange}
              className="w-full h-11 pl-4 pr-12 text-sm bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm font-semibold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none group-focus-within:text-indigo-500 transition-colors">
              kg
            </span>
          </div>

          {/* Height Input Box */}
          <div className="relative w-full max-w-xs group">
            <input
              type="text"
              placeholder="Enter your height..."
              value={height}
              onChange={handleHeightChange}
              className="w-full h-11 pl-4 pr-12 text-sm bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm font-semibold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none group-focus-within:text-indigo-500 transition-colors">
              cm
            </span>
          </div>

          {/* Error Handler Message Window */}
          {error && (
            <div className="mt-4 p-3 text-center bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm font-medium text-rose-400">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Calculations Window */}
          {bmi !== null && !error && (
            <div className="mt-4 p-4 text-center bg-slate-50 border border-slate-100 rounded-xl w-full max-w-xs">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Your BMI Score
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
                {bmi}
              </h2>
            </div>
          )}

          {/* Dark Charcoal Calculate Button */}
          <button 
            onClick={handleCalculate}
            className="w-full max-w-xs h-11 px-6 text-sm font-semibold text-slate-200 bg-linear-to-b from-[#2e333d] to-[#1e222b] border border-slate-700/50 rounded-xl shadow-md shadow-black/30 hover:text-white hover:from-[#3a404d] hover:to-[#242933] hover:border-slate-600 active:scale-[0.96] active:from-[#1a1d24] active:to-[#16191f] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-150 ease-out cursor-pointer"
          >
            Calculate Your BMI
          </button>

        </div>
      </div>
    </>
  )
}

export default App
