import { Opponent } from "@/util/types";
import SmallWordleBoard from "./SmallWordleBoard";


export default function SmallBoardSimple(props: {
  opponents: Opponent[],
  i: number,
}) {
  const { opponents, i } = props;

  return (
    <SmallWordleBoard
      key={i}
      active={i < opponents.length}
      colors={i < opponents.length ? opponents[i].guessColors : []}
      username={i < opponents.length ? opponents[i].username : ""}
      score={i < opponents.length ? opponents[i].score : 0}
      typing={i < opponents.length ? opponents[i].typing : []}
    />
  );
}