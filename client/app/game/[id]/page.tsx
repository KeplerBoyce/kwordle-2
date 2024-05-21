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
import Timer from "./Timer";


export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const [word, setWord] = useState("");
  const [canType, setCanType] = useState(false);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState<Array<WordleLetter>>([]);
  const [keyColors, setKeyColors] = useState(defaultColors);
  const [solved, setSolved] = useState(false);
  const [opponents, setOpponents] = useState<Array<Opponent>>([]);
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(60);

  useEffect(() => {
    beginTimer();

    const userId = getUserID();
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/events/${userId}`);
    let currWord = word;
    let currOpponents = opponents;

    eventSource.onmessage = (m) => {
      const event: Event = JSON.parse(m.data);
      switch (event.typ) {
        case "NEW_WORD":
          currWord = event.word;
          setWord(currWord);
          break;

        case "CHANGE_PLAYERS":
          currOpponents = event.players
            .filter(p => p.userId !== userId)
            .map(p => {
              return {
                userId: p.userId,
                username: p.username,
                guessColors: guessesToColors(p.guesses, currWord),
                score: p.score,
                typing: p.typing,
              };
            });
          setOpponents([...currOpponents]);
          break;

        case "TYPING":
          const opponentIdx = currOpponents.findIndex(p => p.userId === event.userId);
          if (opponentIdx >= 0) {
            currOpponents[opponentIdx].typing = event.typing;
            setOpponents([...currOpponents]);
          }
          break;

        case "GAME_FULL":
          currWord = event.word;
          setWord(currWord);

          currOpponents = event.players
            .filter(p => p.userId !== userId)
            .map(p => {
              return {
                userId: p.userId,
                username: p.username,
                guessColors: guessesToColors(p.guesses, currWord),
                score: p.score,
                typing: p.typing,
              };
            });
          setOpponents(currOpponents);

          const player = event.players.find(p => p.userId === userId);
          if (player) {
            const colors = guessesToColors(player.guesses, currWord);
            for (let r = 0; r < player.guesses.length; r++) {
              for (let c = 0; c < 5; c++) {
                grid.push({
                  char: player.guesses[r].charAt(c) as Char,
                  color: colors[r * 5 + c],
                })
                updateCharColor(player.guesses[r].charAt(c) as Char, colors[r * 5 + c]);
              }
            }
            if (player.guesses.length > 0 &&
                player.guesses[player.guesses.length - 1] === currWord) {
              setSolved(true);
            } else {
              setRow(player.guesses.length);
            }
          }
          setCanType(true);
          break;
      }
    };
    return () => eventSource.close();
  }, []);

  const beginTimer = () => {
    setStartTime(Date.now);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = 60 - Math.floor((Date.now() - startTime) / 1000);
      setTime(newTime)
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

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

  const sendTypingReq = async (typing: boolean[]) => {
    const userId = getUserID();
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/${id}/user/${userId}/typing`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        typing,
      }),
    });
  }

  const guessWord = (guess: string) => {
    sendGuessReq(guess);
    const colors = guessesToColors([guess], word);
    for (let c = 0; c < 5; c++) {
      grid[row * 5 + c].color = colors[c];
      updateCharColor(grid[row * 5 + c].char, colors[c]);
    }
    setGrid([...grid]);
    if (guess === word) {
      setSolved(true);
    } else {
      setRow(row + 1);
      setCol(0);
    }
  }

  const addChar = (char: Char) => {
    if (col > 4 || solved || !canType) {
      return;
    }

    const typing = [];
    for (let i = 0; i <= col; i++) {
      typing.push(true);
    }
    for (let i = col + 1; i < 5; i++) {
      typing.push(false);
    }
    sendTypingReq(typing);

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

    const typing = [];
    for (let i = 0; i < col - 1; i++) {
      typing.push(true);
    }
    for (let i = col - 1; i < 5; i++) {
      typing.push(false);
    }
    sendTypingReq(typing);

    grid.splice(grid.length - 1, 1);
    setGrid([...grid])
    setCol(col - 1);
  }

  const handleEnter = async () => {
    sendTypingReq([false, false, false, false, false]);
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

  const updateCharColor = (char: Char, color: WordleColor) => {
    if (keyColors[char] === "white") {
      keyColors[char] = color;
    } else if (keyColors[char] === "gray") {
      return;
    } else if (keyColors[char] === "yellow" && color === "green") {
      keyColors[char] = "green";
    }
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

          <Timer time={time} />

          <div className="flex gap-8 items-center">

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) =>
                <SmallWordleBoard
                  key={i}
                  active={i < opponents.length}
                  colors={i < opponents.length ? opponents[i].guessColors : []}
                  username={i < opponents.length ? opponents[i].username : ""}
                  score={i < opponents.length ? opponents[i].score : 0}
                  typing={i < opponents.length ? opponents[i].typing : []}
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
                  score={i + 4 < opponents.length ? opponents[i].score : 0}
                  typing={i + 4 < opponents.length ? opponents[i].typing : []}
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
