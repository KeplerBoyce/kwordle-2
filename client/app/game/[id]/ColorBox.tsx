import { WordleColor } from "@/util/types";


export default function ColorBox(props: { color: WordleColor }) {
  const { color } = props;

  return (
    <div className={"w-6 h-6 border-2 border-slate-200 "
      + (color === "green" ? "bg-wordle-green" :
        (color === "yellow" ? "bg-wordle-yellow" :
        (color === "gray" ? "bg-wordle-gray" : "bg-transparent")))
    } />
  );
}