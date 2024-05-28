import { Result } from "@/util/types";


export default function Results(props: {
  active: boolean,
  results: {
    [userId: string]: Result,
  },
  myId: string,
}) {
  const { active, results, myId } = props;

  return (
    <div className={"z-10 absolute inset-0 flex justify-center items-center transition duration-300 "
      + (active ? "bg-black/50 visible" : "bg-transparent invisible")
    }>
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl text-black mb-4 uppercase font-bold">
          Results
        </h1>
        <div className="rounded-xl bg-white border-3 border-slate-200 flex flex-col divide-y-3 divide-slate-200 overflow-hidden">
          <div className="bg-slate-100 flex uppercase font-bold divide-x-3 divide-slate-200">
            <p className="w-16 px-2 py-1 text-center">
              Rank
            </p>
            <p className="w-24 px-2 py-1 text-center">
              Player
            </p>
            <p className="w-24 px-2 py-1 text-center">
              Score
            </p>
            <p className="w-36 px-2 py-1 text-center">
              Avg. guesses
            </p>
            <p className="flex-grow whitespace-nowrap px-2 py-1 text-center">
              Round ranks
            </p>
          </div>

          {Object.keys(results).sort((a, b) => results[b].score - results[a].score).map((userId, i) =>
            <div key={i} className={"flex divide-x-3 divide-slate-200 "
              + (myId === userId ? "bg-green-100" : "bg-transparent")
            }>
              <p className={"w-16 px-2 py-1 font-semibold "
                + (i === 0 ? "text-amber-400 font-bold"
                : (i === 1 ? "text-gray-400 font-bold"
                : (i === 2 ? "text-amber-700 font-bold" : "text-slate-400")))
              }>
                {`${i + 1}${i === 0 ? "st" : (i === 1 ? "nd" : (i === 2 ? "rd" : "th"))}`}
              </p>
              <p className="w-24 px-2 py-1 font-semibold">
                {results[userId].username}
              </p>
              <p className="w-24 px-2 py-1 text-wordle-green font-bold text-center">
                {results[userId].score}
              </p>
              <p className="w-36 px-2 py-1 font-bold text-center">
                {results[userId].numGuesses.filter((_, i) => results[userId].solves[i]).length > 0
                  ? (results[userId].numGuesses.filter((_, i) => results[userId].solves[i])
                    .reduce((a, b) => a + b) / results[userId].numGuesses.filter((_, i) =>
                      results[userId].solves[i]).length).toFixed(2)
                  : 0}
              </p>
              <div className="w-min flex divide-x-3 divide-slate-200">
                {results[userId].numGuesses.map((_, i) =>
                  <div key={i} className="w-16 flex gap-1 items-center">
                    {(results[userId].solves[i] === false)
                      ? <p className="w-full text-red-500 text-center px-2 py-1 font-bold">
                        —
                      </p>
                      : <p className={"w-full text-center px-2 py-1 "
                        + (results[userId].ranks[i] === 1 ? "text-amber-400 font-bold"
                        : (results[userId].ranks[i] === 2 ? "text-gray-400 font-bold"
                        : (results[userId].ranks[i] === 3 ? "text-amber-700 font-bold" : "text-slate-400")))
                      }>
                        {`${results[userId].ranks[i]}${results[userId].ranks[i] === 1 ? "st" :
                          (results[userId].ranks[i] === 2 ? "nd" :
                          (results[userId].ranks[i] === 3 ? "rd" : "th"))}`}
                      </p>
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
