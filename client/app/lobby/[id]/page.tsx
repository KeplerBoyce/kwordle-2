"use client"

import MainCenter from "@/app/MainCenter";
import RoundedBox from "@/app/RoundedBox";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const [randomName, setRandomName] = useState("");
  const [username, setUsername] = useState("");
  const [opponents, setOpponents] = useState<Array<string>>(["player1", "heheheha", "kerbler"]);
  const [copied, setCopied] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);

  useEffect(() => {
    const name = genRandomUsername();
    setRandomName(name);
    setUsername(name);
    setDBUsername(name);
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    if (!usernameSaved) {
      return;
    }
    setTimeout(() => {
      setUsernameSaved(false);
    }, 2000);
  }, [usernameSaved]);

  const setDBUsername = async (username: string) => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "";
      for (let i = 0; i < 32; i++) {
        userId += Math.floor(Math.random() * 10);
      }
      localStorage.setItem("userId", userId);
    }
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    const res = await fetch(`/api/game/${id}/user`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        username,
      }),
    });
    const data = await res.json();
    setUsernameLoading(false);
    setUsernameSaved(true);
    updateUsernames(data);
  }

  const genRandomUsername = () => {
    return "user" + Math.floor(Math.random() * 10)
        + Math.floor(Math.random() * 10)
        + Math.floor(Math.random() * 10);
  }

  const copyGameLink = () => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/lobby/${id}`;
    navigator.clipboard.writeText(link);
    console.log(link);
    setCopied(true);
  }

  const saveUsername = () => {
    setUsernameLoading(true);
    setUsername(username.trim());
    setDBUsername(username.trim());
  }

  const updateUsernames = (usernames: string[]) => {
    console.log(usernames);
  }

  const createGame = () => {
    console.log("creating game");
  }

  return (
    <MainCenter>
      <RoundedBox className="py-12">
        <div className="w-full px-6 flex flex-col gap-2 items-center">
          <p className="font-semibold uppercase">
            Game ID:
          </p>
          <h1 className="text-5xl font-mono uppercase">
            {id}
          </h1>
          <Button
            size="lg"
            radius="lg"
            color="primary"
            disabled={copied}
            onClick={copyGameLink}
            className={"uppercase font-bold text-sm h-10 p-3" + (copied ? " bg-slate-400" : "")}
          >
            {copied ? "Copied!" : "Copy game link"}
          </Button>
        </div>

        <div className="w-full px-6 flex flex-col gap-1 items-center">
          <p className="font-bold uppercase">
            Your username:
          </p>

          <div className="h-10 flex items-center gap-2">
            <input
              type="text"
              maxLength={16}
              className={`h-full w-48 p-1 text-center rounded-xl text-xl
                font-semibold border-2 transition duration-150 focus:outline-none `
                + (username ? "border-slate-300" : "border-red-500")}
              placeholder={randomName}
              value={username}
              onChange={e => {
                if (e.target.value && !e.target.value.trim()) {
                  setUsername("");
                  return;
                }
                if (e.target.value.match(/^$|^[a-zA-Z0-9 ]+$/)
                    && e.target.value !== " ") {
                  setUsername(e.target.value);
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  saveUsername();
                }
              }}
            />
            <Button
              size="lg"
              radius="lg"
              color="primary"
              disabled={!username || usernameSaved}
              isLoading={usernameLoading}
              onClick={saveUsername}
              className={"uppercase font-bold text-sm h-10 p-3"
                + (!username || usernameSaved || usernameLoading ? " bg-slate-400" : "")}
            >
              {usernameLoading ? "" : (usernameSaved ? "Saved!" : "Save")}
            </Button>
          </div>
        </div>

        <div className="w-full h-0 border border-slate-400" />

        <div className="w-full px-6 flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1 items-center">
            <p className="font-bold uppercase mb-1">
              Players:
            </p>
            {[...Array(9)].map((_, i) =>
              <div key={i} className="flex border-2 border-slate-300 rounded-lg w-full px-2">
                <p className="w-6 font-bold text-slate-400">
                  {i + 1}.
                </p>
                <p className="font-semibold">
                  {i < opponents.length ? opponents[i] : ""}
                </p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            radius="lg"
            color="success"
            onClick={createGame}
            className="w-full uppercase font-semibold text-xl h-16"
          >
            Start
          </Button>
        </div>
      </RoundedBox>
    </MainCenter>
  );
}