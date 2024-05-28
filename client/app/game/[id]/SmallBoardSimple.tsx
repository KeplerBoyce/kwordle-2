import { Opponent } from "@/util/types";
import SmallWordleBoard from "./SmallWordleBoard";


export default function SmallBoardSimple(props: {
  opponents: Opponent[],
  i: number,
  showLetters: boolean,
}) {
  const { opponents, i, showLetters } = props;

  return (
    <SmallWordleBoard
      key={i}
      active={i < opponents.length}
      colors={i < opponents.length ? opponents[i].guessColors : []}
      username={i < opponents.length ? opponents[i].username : ""}
      score={i < opponents.length ? opponents[i].score : 0}
      guesses={i < opponents.length ? opponents[i].guesses : []}
      typing={i < opponents.length ? opponents[i].typing : []}
      showLetters={showLetters}
    />
  );
}