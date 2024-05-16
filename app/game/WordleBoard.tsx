"use client"

import LetterBox from "./LetterBox";
import { Char, WordleColor, WordleLetter } from "@/util/types";


export default function WordleBoard(props: {
  word: string,
  row: number,
  col: number,
  grid: WordleLetter[],
  setColor: (char: Char, color: WordleColor) => void,
}) {
  const { word, row, col, grid, setColor } = props;

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-1.5">
        {[...Array(6)].map((_, r) => {
          return <div key={r} className="flex gap-1.5">
            {[...Array(5)].map((_, c) => {
              return <LetterBox
                key={c}
                active={r === row}
                char={grid[r * 5 + c]?.char}
                color={grid[r * 5 + c]?.color}
              />
            })}
          </div>
        })}
      </div>
    </div>
  );
}
