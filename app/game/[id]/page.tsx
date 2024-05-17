"use client"

import { useEffect, useState } from "react";
import WordleBoard from "./WordleBoard";
import MainCenter from "@/app/MainCenter";
import { Char, WordleColor, WordleLetter, defaultColors, genAnswer, guessIsValid, keys } from "@/util/types";
import Keyboard from "./Keyboard";
import { useKeyPressEvent } from "react-use";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import SmallWordleBoard from "./SmallWordleBoard";


export default function Home() {
  const [word, setWord] = useState("");
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState<Array<WordleLetter>>([]);
  const [keyColors, setKeyColors] = useState(defaultColors);
  const [solved, setSolved] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setWord(genAnswer());
  }, []);

  const clearRow = () => {
    grid.splice(row * 5, 5);
    setCol(0);
  }

  const guessWord = (guess: string) => {
    const numLeft: {
      [char: string]: number
    } = {};
    
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
        setColor(c as Char, "green");
      }
    })

    if (guess === word) {
      setSolved(true);
      return;
    }

    guess.split('').forEach((c, i) => {
      if (grid[row * 5 + i].color === "green") {
        return;
      }
      if (c in numLeft && numLeft[c] > 0) {
        numLeft[c]--;
        grid[row * 5 + i].color = "yellow";
        setColor(c as Char, "yellow");
      } else {
        grid[row * 5 + i].color = "gray";
        setColor(c as Char, "gray");
      }
    })

    setGrid([...grid]);
    setRow(row + 1);
    setCol(0);
  }

  const addChar = (char: Char) => {
    if (col > 4) {
      return;
    }
    setGrid([...grid, {
      char: char,
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

  const setColor = (char: Char, color: WordleColor) => {
    keyColors[char] = color;
    setKeyColors({...keyColors});
  }

  for (const key of keys) {
    useKeyPressEvent(key, e => addChar(e.key as Char));
  }
  useKeyPressEvent('Backspace', handleBackspace);
  useKeyPressEvent('Enter', handleEnter);

  return (
    <MainCenter>
      <div className="h-screen flex flex-col items-center">
        <div className="p-4 flex w-full border-b-3 border-slate-200 items-center justify-between">

          <div className="w-1/4">
            <Link href="/">
              <Button className="bg-transparent text-slate-500 flex gap-2 items-center">
                <div className="text-3xl">
                  ←
                </div>
                <p className="text-xl font-bold">
                  Home
                </p>
              </Button>
            </Link>
          </div>

          <p className="text-3xl font-bold">
            Kwordle
          </p>

          <div className="w-1/4" />
        </div>

        <div className="h-full py-12 flex flex-col items-center justify-evenly">
          <div className="flex gap-8 items-center">

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) =>
                <SmallWordleBoard
                  active={i + 1 < players.length}
                  colors={[]}
                  username="player 2"
                />
              )}
            </div>

            <WordleBoard
              word={word}
              row={row}
              col={col}
              grid={grid}
            />

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) =>
                <SmallWordleBoard
                  active={i + 5 < players.length}
                  colors={[]}
                  username="player 2"
                />
              )}
            </div>
          </div>

          <Keyboard colors={keyColors} keyCallback={addChar} />
        </div>
      </div>
    </MainCenter>
  );
}
