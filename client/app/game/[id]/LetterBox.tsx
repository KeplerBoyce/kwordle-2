import { Char, WordleColor } from "@/util/types";


export default function LetterBox(props: {
  active: boolean,
  char?: Char,
  color?: WordleColor,
}) {
  const { active, char, color } = props;

  return (
    <div className={`border-3 w-16 h-16 flex justify-center items-center text-3xl
      transition duration-150 font-semibold uppercase `
      + (color === "gray" ? "bg-wordle-gray border-wordle-gray text-white" :
        (color === "yellow" ? "bg-wordle-yellow border-wordle-yellow text-white" :
        (color === "green" ? "bg-wordle-green border-wordle-green text-white" :
        ("bg-transparent text-slate-500 " + (active ? "border-slate-400" : "border-slate-200")))))
    }>
      {char}
    </div>
  );
}
