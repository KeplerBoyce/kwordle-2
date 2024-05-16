"use client"

import { useState } from "react";
import LetterBox from "./LetterBox";
import { useKeyPressEvent } from "react-use";
import { Char, WordleLetter, guessIsValid, keys } from "@/util/types";


export default function WordleBoard(props: { word: string }) {
  const { word } = props;

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState<Array<WordleLetter>>([]);

  const clearRow = () => {
    grid.splice(row * 5, 5);
    setCol(0);
  }

  const guessWord = (guess: string) => {
    const numLeft: { [char: string]: number } = {};
    word.split('').forEach(c => {
      if (c in numLeft) {
        numLeft[c]++;
      } else {
        numLeft[c] = 1;
      }
    });

    guess.split('').forEach((c, i) => {
      if (c === word.charAt(i)) {
        numLeft[c]--;
        grid[row * 5 + i].color = "green";
      }
    })

    guess.split('').forEach((c, i) => {
      if (grid[row * 5 + i].color === "green") {
        return;
      }
      if (c in numLeft && numLeft[c] > 0) {
        numLeft[c]--;
        grid[row * 5 + i].color = "yellow";
      } else {
        grid[row * 5 + i].color = "gray";
      }
    })

    setGrid([...grid]);
    setRow(row + 1);
    setCol(0);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (col > 4) {
      return;
    }
    setGrid([...grid, {
      char: e.key as Char,
      color: "white",
    }]);
    setCol(col + 1);
  }

  const handleBackspace = () => {
    if (col <= 0) {
      return;
    }
    grid.splice(grid.length - 1, 1);
    setGrid([...grid])
    setCol(col - 1);
  }

  const handleEnter = async () => {
    if (col < 5) {
      clearRow();
      return;
    }
    const guess = grid
      .slice(row * 5, row * 5 + 5)
      .map(l => l.char)
      .join('');

    if (guessIsValid(guess)) {
      guessWord(guess);
    } else {
      clearRow();
    }
  }

  for (const key of keys) {
    useKeyPressEvent(key, handleKeyDown);
  }
  useKeyPressEvent('Backspace', handleBackspace);
  useKeyPressEvent('Enter', handleEnter);

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
