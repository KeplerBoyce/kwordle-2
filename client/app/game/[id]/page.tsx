"use client"

import { useEffect, useState } from "react";
import WordleBoard from "./WordleBoard";
import MainCenter from "@/app/MainCenter";
import { Char, Event, Opponent, Player, WordleColor, WordleLetter, defaultColors, guessIsValid, guessesToColors, keys } from "@/util/types";
import Keyboard from "./Keyboard";
import { useKeyPressEvent } from "react-use";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import SmallWordleBoard from "./SmallWordleBoard";


export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const [word, setWord] = useState("");
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState<Array<WordleLetter>>([]);
  const [keyColors, setKeyColors] = useState(defaultColors);
  const [solved, setSolved] = useState(false);
  const [opponents, setOpponents] = useState<Array<Opponent>>([]);

  useEffect(() => {
    const userId = getUserID();
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/events/${userId}`);
    let currWord = word;

    eventSource.onmessage = (m) => {
      const event: Event = JSON.parse(m.data);
      switch (event.typ) {
        case "NEW_WORD":
          setWord(event.word);
          currWord = event.word;
          break;
        case "CHANGE_PLAYERS":
          setOpponents(event.players
            .filter(p => p.userId !== userId)
            .map(p => {
              return {
                username: p.username,
                guessColors: guessesToColors(p.guesses, currWord),
                score: p.score,
              };
            }));
          break;
      }
    };
    return () => eventSource.close();
  }, []);

  const getUserID = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "";
      for (let i = 0; i < 32; i++) {
        userId += Math.floor(Math.random() * 10);
      }
      localStorage.setItem("userId", userId);
    }
    return userId;
  }

  const clearRow = () => {
    grid.splice(row * 5, 5);
    setCol(0);
  }

  const sendGuessReq = async (guess: string) => {
    const userId = getUserID();
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/${id}/user/${userId}/guess`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        guess,
      }),
    });
  }

  const guessWord = (guess: string) => {
    sendGuessReq(guess);

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
                  key={i}
                  active={i < opponents.length}
                  colors={i < opponents.length ? opponents[i].guessColors : []}
                  username={i < opponents.length ? opponents[i].username : ""}
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
                  key={i}
                  active={i + 4 < opponents.length}
                  colors={i + 4 < opponents.length ? opponents[i].guessColors : []}
                  username={i + 4 < opponents.length ? opponents[i].username : ""}
                />
              )}
            </div>
          </div>

          <Keyboard
            colors={keyColors}
            keyCallback={addChar}
            enterCallback={handleEnter}
            backspaceCallback={handleBackspace}
          />
        </div>
      </div>
    </MainCenter>
  );
}
