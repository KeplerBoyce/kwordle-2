import { Char, WordleColor } from "@/util/types";
import ColorBox from "./ColorBox";


export default function SmallWordleBoard(props: {
  active: boolean,
  colors: WordleColor[],
  username?: string,
  score: number,
  guesses: string[],
  typing: (Char | null)[],
  showLetters: boolean,
}) {
  const {
    active,
    colors,
    username,
    score,
    guesses,
    typing,
    showLetters,
  } = props;

  return (
    <div className={"flex flex-col gap-1 border-2 p-2 rounded-xl transition duration-250 "
      + (colors.length && colors.slice(colors.length - 4, colors.length).every(c => c === "green")
        ? "border-wordle-green" : "border-slate-200")
    }>
      <p className="text-center font-semibold text-black">
        {username}
      </p>
      
      <div className={"flex flex-col gap-0.5 "
        + (active ? "bg-transparent" : "bg-slate-200")}>
          
        {[...Array(6)].map((_, r) =>
          <div key={r} className="flex gap-0.5">
            {[...Array(5)].map((_, c) =>
              <ColorBox
                key={c}
                color={r >= guesses.length ? "white" : colors[r * 5 + c]}
                letter={(active && r < guesses.length) ? guesses[r].charAt(c) as Char :
                  ((active && r === guesses.length) ? typing[c] : null)
                }
                showLetter={showLetters}
              />
            )}
          </div>
        )}
      </div>

      <p className="text-center font-semibold text-xl text-wordle-green">
        {username ? score : ""}
      </p>
    </div>
  );
}