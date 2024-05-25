"use client"

import { useEffect, useState } from "react";
import WordleBoard from "./WordleBoard";
import MainCenter from "@/app/MainCenter";
import { Char, Event, GameState, Opponent, WordleColor, WordleLetter, defaultColors, guessIsValid, guessesToColors, keys } from "@/util/types";
import Keyboard from "./Keyboard";
import { useKeyPressEvent } from "react-use";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import SmallWordleBoard from "./SmallWordleBoard";
import Timer from "./Timer";
import Boards from "./Boards";
import Header from "./Header";


export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const [gameState, setGameState] = useState<GameState>("PRE_START");
  const [word, setWord] = useState("");
  const [canType, setCanType] = useState(false);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState<Array<WordleLetter>>([]);
  const [keyColors, setKeyColors] = useState({...defaultColors});
  const [solved, setSolved] = useState(false);
  const [opponents, setOpponents] = useState<Array<Opponent>>([]);
  const [startTime, setStartTime] = useState(0);
  const [roundTime, setRoundTime] = useState(60000);
  const [time, setTime] = useState(60000);
  const [preStartTime, setPreStartTime] = useState(0);
  const [preRoundTime, setPreRoundTime] = useState(5000);
  const [preTime, setPreTime] = useState(5000);
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [showRoundScore, setShowRoundScore] = useState(false);
  const [username, setUsername] = useState("");
  const [round, setRound] = useState(0);
  const [prevWord, setPrevWord] = useState("");

  useEffect(() => {
    const userId = getUserID();
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/events/${userId}`);
    let currWord = word;
    let currOpponents = opponents;
    let currScore = score;
    let currRound = round;

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
          const you = event.players.find(p => p.userId === userId);
          if (you) {
            if (you.score > currScore) {
              setRoundScore(you.score - currScore);
            }
            currScore = you.score;
            setScore(you.score);
          }
          break;

        case "TYPING":
          const opponentIdx = currOpponents.findIndex(p => p.userId === event.userId);
          if (opponentIdx >= 0) {
            currOpponents[opponentIdx].typing = event.typing;
            setOpponents([...currOpponents]);
          }
          break;

        case "GAME_FULL":
          setGameState(event.state);

          currWord = event.word;
          setWord(currWord);

          setRoundTime(event.roundTime);
          setPreRoundTime(event.preRoundTime);
          if (event.state === "PRE_ROUND") {
            setPreStartTime(Date.now() - (event.preRoundTime - event.msLeft));
          } else if (event.state === "ROUND") {
            setStartTime(Date.now() - (event.roundTime - event.msLeft));
          }
          currRound = event.round;
          setRound(event.round);

          if ((event.state === "PRE_ROUND" && event.round > 0) || event.state === "ENDED") {
            setPrevWord(currWord);
          }

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
            setScore(player.score);
            setUsername(player.username);
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

        case "ROUND_START":
          setGrid([]);
          setRow(0);
          setCol(0);
          setSolved(false);
          setCanType(true);
          setKeyColors({...defaultColors});
          setStartTime(Date.now());
          currRound++;
          setRound(currRound);
          setGameState("ROUND");
          break;

        case "ROUND_END":
          setPrevWord(currWord);
          setPreStartTime(Date.now());
          setGameState("PRE_ROUND");
          break;

        case "GAME_END":
          setPrevWord(currWord);
          setGameState("ENDED");
          break;
      }
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(roundTime - (Date.now() - startTime))
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreTime(preRoundTime - (Date.now() - preStartTime))
    }, 100);
    return () => clearInterval(interval);
  }, [preStartTime]);

  useEffect(() => {
    if (roundScore !== 0) {
      setShowRoundScore(true);
    }
  }, [roundScore]);

  useEffect(() => {
    if (showRoundScore) {
      setTimeout(() => {
        setShowRoundScore(false);
      }, 100);
    }
  }, [showRoundScore]);

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
    if (col > 4 || solved || !canType || gameState !== "ROUND") {
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
      <div className="w-full h-screen flex flex-col items-center">
        <Header />

        <div className="h-full py-12 flex flex-col items-center justify-evenly">
          <div className="flex flex-col gap-4 items-center">
            <Timer
              time={(round === 0 && gameState === "PRE_ROUND")
                ? roundTime : ((gameState === "PRE_ROUND" || gameState === "ENDED")
                ? 0 : (Date.now() - startTime > 100 ? time : roundTime))}
              duration={roundTime}
              width={500}
              textOverride={(gameState === "PRE_ROUND" && round === 0)
                ? "Get ready!"
                : (gameState === "PRE_ROUND"
                  ? "Round ended!"
                  : (gameState === "ENDED"
                    ? "Game ended!"
                    : undefined))
              }
            />
            <div className="flex gap-2 items-center h-8 transition duration-150
                text-base uppercase">
              {preTime >= 0 ? <>
                  <p className="font-bold">
                    {(round === 0 && gameState === "PRE_ROUND") ? "Game starting in:" : "Next round in:"}
                  </p>
                  <p className="font-mono text-3xl text-black">
                    {Math.ceil(preTime / 1000)}
                  </p>
                </> : <p className="font-bold">
                  {gameState === "ENDED" ? "Results will appear soon..." : "Type your guesses!"}
                </p>}
            </div>
          </div>

          <div className={"flex text-base uppercase font-bold rounded-xl px-6 py-4 transition duration-150 "
            + ((gameState === "ENDED" || (gameState === "PRE_ROUND" && round > 0)) ? "text-black bg-slate-200" : "text-transparent bg-transparent")
          }>
            The word was: {prevWord}
          </div>

          <Boards opponents={opponents} middle={
            <div className="flex flex-col gap-4">
              <div className="flex px-1 items-end">
                <p className="text-black font-semibold text-xl flex-grow">
                  {username}
                </p>
                <div className="flex flex-col gap-1 items-start">
                  <p className={"text-3xl font-bold -translate-x-4 " + (!showRoundScore
                    ? "-translate-y-5 text-transparent transition duration-1000"
                    : "translate-y-0 text-wordle-green")
                  }>
                    +{roundScore}
                  </p>
                  <div className="flex items-end gap-1">
                    <p className="font-bold uppercase text-3xl text-wordle-green">
                      {score}
                    </p>
                    <p className="font-bold uppercase text-sm text-black pb-1">
                      points
                    </p>
                  </div>
                </div>
              </div>

              <WordleBoard
                word={word}
                row={row}
                col={col}
                grid={grid}
              />
            </div>}
          />

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
