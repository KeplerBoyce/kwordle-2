import { WordleColor } from "@/util/types";


export default function ColorBox(props: {
  color: WordleColor,
  typing: boolean,
}) {
  const { color, typing } = props;

  return (
    <div className={"flex justify-center items-center w-6 h-6 border-2 border-slate-200 transition duration-150 "
      + (color === "green" ? "bg-wordle-green" :
        (color === "yellow" ? "bg-wordle-yellow" :
        (color === "gray" ? "bg-wordle-gray" : "bg-transparent")))
    }>
      <div className={"w-2 h-2 rounded-full transition duration-150 "
        + (typing ? "bg-slate-400" : "bg-transparent")} />
    </div>
  );
}