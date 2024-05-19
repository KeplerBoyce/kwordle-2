"use client"

import { Button } from "@nextui-org/button";
import MainCenter from "./MainCenter";
import RoundedBox from "./RoundedBox";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const router = useRouter();

  const [gameId, setGameId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const createGame = async () => {
    setCreateLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/new`, {
      method: "POST",
    });
    const data = await res.json();
    router.push(`/lobby/${data.id}`);
  }

  const joinGame = () => {
    setJoinLoading(true);
    if (gameId.length !== 6) {
      return;
    }
    router.push(`/lobby/${gameId.toUpperCase()}`);
  }

  return (
    <MainCenter>
      <RoundedBox className="py-12">
        <h1 className="text-5xl text-black font-semibold px-6">
          Kwordle
        </h1>

        <p className="italic">
          Real time 1-on-1 wordle game
        </p>

        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full px-6">
            <Button
              size="lg"
              radius="lg"
              color="success"
              isLoading={createLoading}
              onClick={createGame}
              className="w-full uppercase font-bold"
            >
              {createLoading ? "" : "Create game"}
            </Button>
          </div>

          <div className="w-full flex gap-2 items-center">
            <div className="flex-grow h-0 border border-slate-400" />
            <p className="text-center">
              OR
            </p>
            <div className="flex-grow h-0 border border-slate-400" />
          </div>

          <div className="w-full px-6 flex flex-col gap-1">
            <p className="pl-2 uppercase font-bold text-sm">
              Game ID
            </p>
            <input
              type="text"
              maxLength={6}
              className="mb-2 w-full p-1 text-center rounded-xl text-3xl
                font-mono uppercase border-2 border-slate-300 focus:outline-none"
              placeholder="123XYZ"
              value={gameId}
              onChange={e => {
                if (e.target.value.match(/^$|^[a-zA-Z0-9]+$/)) {
                  setGameId(e.target.value);
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  joinGame();
                }
              }}
            />
            <Button
              size="lg"
              radius="lg"
              color="primary"
              disabled={gameId.length !== 6}
              isLoading={joinLoading}
              onClick={joinGame}
              className={"w-full uppercase font-bold" + (gameId.length !== 6 ? " bg-slate-400" : "")}
            >
              {joinLoading ? "" : "Join game"}
            </Button>
          </div>
        </div>
      </RoundedBox>
    </MainCenter>
  );
}
