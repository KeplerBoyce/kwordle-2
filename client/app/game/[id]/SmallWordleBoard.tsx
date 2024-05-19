import { WordleColor } from "@/util/types";
import ColorBox from "./ColorBox";


export default function SmallWordleBoard(props: {
  active: boolean,
  colors: WordleColor[],
  username?: string,
}) {
  const { active, colors, username } = props;

  return (
    <div className="flex flex-col gap-1">
      <div className={"flex flex-col gap-0.5"
        + (active ? "" : " bg-slate-200")}>
          
        {[...Array(6)].map((_, r) =>
          <div key={r} className="flex gap-0.5">
            {[...Array(5)].map((_, c) =>
              <ColorBox key={c} color={colors[r * 5 + c]} />
            )}
          </div>
        )}
      </div>

      <p className="text-center">
        {username}
      </p>
    </div>
  );
}