import { WordleColor } from "@/util/types";
import ColorBox from "./ColorBox";


export default function SmallWordleBoard(props: {
  active: boolean,
  colors: WordleColor[],
  username?: string,
  score: number,
  typing: boolean[],
}) {
  const { active, colors, username, score, typing } = props;

  return (
    <div className="flex flex-col gap-1 border-2 p-2 rounded-xl">
      <p className="text-center font-bold">
        {username}
      </p>
      
      <div className={"flex flex-col gap-0.5 "
        + (active ? "bg-transparent" : "bg-slate-200")}>
          
        {[...Array(6)].map((_, r) =>
          <div key={r} className="flex gap-0.5">
            {[...Array(5)].map((_, c) =>
              <ColorBox
                key={c}
                color={colors[r * 5 + c]}
                typing={active && r * 5 === colors.length && typing[c]}
              />
            )}
          </div>
        )}
      </div>

      <p className="text-center font-bold text-xl text-wordle-green font-mono">
        {username ? score : ""}
      </p>
    </div>
  );
}