"use client"

import { Button } from "@nextui-org/button";
import MainCenter from "./MainCenter";
import RoundedBox from "./RoundedBox";


export default function Home() {
  const createGame = () => {
    console.log("creating game")
  }

  const joinGame = () => {
    console.log("joining game")
  }

  return (
    <MainCenter>
      <RoundedBox>
        <h1 className="text-5xl text-black font-semibold">
          Kwordle
        </h1>

        <p className="italic">
          Real time 1-on-1 wordle game
        </p>

        <div className="flex flex-col gap-1">
          <Button size="lg" radius="lg" color="primary" onClick={createGame}>
            Create game
          </Button>

          <Button size="lg" radius="lg" color="primary" onClick={joinGame}>
            Join game
          </Button>
        </div>
      </RoundedBox>
    </MainCenter>
  );
}
