import { Char, WordleColor } from "@/util/types";


export default function ColorBox(props: {
  color: WordleColor,
  letter: Char | null,
  showLetter: boolean,
}) {
  const { color, letter, showLetter } = props;

  return (
    <div className={"flex justify-center items-center w-6 h-6 border-2 border-slate-200 transition duration-150 "
      + (color === "green" ? "bg-wordle-green" :
        (color === "yellow" ? "bg-wordle-yellow" :
        (color === "gray" ? "bg-wordle-gray" : "bg-transparent")))
    }>
      {showLetter
        ? <p className={"uppercase text-sm font-bold transition duration-150 "
          + (color === "white" ? "text-slate-500" : "text-white")
        }>
          {letter ?? ""}
        </p>
        : <div className={"w-2 h-2 rounded-full transition duration-150 "
          + ((color === "white" && letter) ? "bg-slate-500" : "bg-white")
        }/>
      }
    </div>
  );
}