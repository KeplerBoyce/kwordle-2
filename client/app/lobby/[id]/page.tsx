"use client"

import MainCenter from "@/app/MainCenter";
import RoundedBox from "@/app/RoundedBox";
import { Event } from "@/util/types";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const router = useRouter();

  const [randomName, setRandomName] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState<Array<string>>([]);
  const [copied, setCopied] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [firstNameSave, setFirstNameSave] = useState(true);

  useEffect(() => {
    fetchEventStream();
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

  const fetchEventStream = async () => {
    const userId = getUserID();
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/events/${userId}`);
    
    eventSource.onmessage = (m) => {
      const event: Event = JSON.parse(m.data);
      switch (event.typ) {
        case "CHANGE_PLAYERS":
          setPlayers(event.players.map(p => p.username));
          break;
        case "START_GAME":
          redirectToGame();
          break;
      }
    }
  }

  const setDBUsername = async (username: string) => {
    const userId = getUserID();
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/${id}/user`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        username,
      }),
    });
    setUsernameLoading(false);
    if (firstNameSave) {
      setFirstNameSave(false);
    } else {
      setUsernameSaved(true);
    }
  }

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

  const genRandomUsername = () => {
    return "user" + Math.floor(Math.random() * 10)
        + Math.floor(Math.random() * 10)
        + Math.floor(Math.random() * 10);
  }

  const copyGameLink = () => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/lobby/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
  }

  const saveUsername = () => {
    setUsernameLoading(true);
    setUsername(username.trim());
    setDBUsername(username.trim());
  }

  const startGame = async () => {
    setStartLoading(true);
    const hostId = getUserID();
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/${id}/start`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        hostId,
      })
    });
  }

  const redirectToGame = () => {
    setStartLoading(true);
    router.push(`/game/${id}`);
  }

  return (
    <MainCenter>
      <RoundedBox className="py-12">
        <div className="w-full px-6 flex flex-col gap-1 items-center">
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

        <div className="w-full h-0 border border-slate-400" />

        <div className=" w-full px-6 flex flex-col gap-1 items-center">
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

        <div className="w-full px-6 flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1 items-center">
            <p className="font-bold uppercase mb-1">
              Players:
            </p>
            {[...Array(9)].map((_, i) =>
              <div key={i} className="flex border-2 border-slate-300
                  rounded-lg w-full px-2 bg-slate-100">
                <p className="w-6 font-bold text-slate-400">
                  {i + 1}.
                </p>
                <p className="font-semibold">
                  {i < players.length ? players[i] : ""}
                </p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            radius="lg"
            color="success"
            isLoading={startLoading}
            onClick={startGame}
            className="w-full uppercase font-semibold text-2xl h-16"
          >
            {startLoading ? "Starting" : "Start"}
          </Button>
        </div>
      </RoundedBox>
    </MainCenter>
  );
}