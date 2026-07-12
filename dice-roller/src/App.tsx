import { useState, ChangeEvent } from "react"

function App() {
  const [dice, setDice] = useState<number>(1);
  const [image, setImage] = useState<JSX.Element[]>([]);
  const [randomValues, setRandomValues] = useState<number[]>([]);

  const assetUrl = (v: number) => new URL(`./assets/${v}.png`, import.meta.url).href;

  const handleRandomDice = (): void => {
    const values: number[] = [];
    const img: JSX.Element[] = [];
    for (let i = 0; i < dice; i++) {
      const value: number = Math.floor(Math.random() * 6 + 1);
      values.push(value);
      img.push(
        <img
          key={i}
          src={assetUrl(value)}
          alt={`Dice ${value}`}
          className="w-16 h-16 object-contain rounded-md shadow-sm"
        />
      );
    }
    setRandomValues(values);
    setImage(img);

  }

  const handleDiceNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setDice(Number(e.target.value))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Dice Roller
        </h1>

        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Number of Dice</label>
          <input
            type="number"
            value={dice}
            min={1}
            max={6}
            onChange={handleDiceNumber}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg font-medium text-gray-700"
          />
        </div>

        <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-none active:scale-[0.98] transition-all duration-150 cursor-pointer" onClick={handleRandomDice}>
          Roll Dice
        </button>
      </div>


      {
        randomValues && (
          <>
            <div className="flex flex-wrap gap-2 mt-2">
              {randomValues.map((v, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium shadow-sm"
                >
                  {v}
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center justify-center flex-wrap mt-4">{image}</div>
          </>
        )
      }
    </div>
  )
}

export default App
