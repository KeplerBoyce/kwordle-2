"use client"

import Header from "@/app/game/[id]/Header";
import MainCenter from "@/app/MainCenter";
import RoundedBox from "@/app/RoundedBox";
import { Event, genRandomUsername } from "@/util/types";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type ListPlayer = {
  username: string,
  isMe: boolean,
  isHost: boolean,
}

export default function Home({ params }: {
  params: {
    id: string,
  },
}) {
  const { id } = params;

  const router = useRouter();

  const [randomName, setRandomName] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState<Array<ListPlayer>>([]);
  const [copied, setCopied] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [firstNameSave, setFirstNameSave] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    const asyncFunc = async () => {
      const userId = getUserID();
      let hostId = await fetchHost();

      let initUsername;
      const name = genRandomUsername();
      setRandomName(name);
      const lsUsername = localStorage.getItem("username");
      if (lsUsername) {
        setUsername(lsUsername);
        initUsername = lsUsername;
      } else {
        setUsername(name);
        initUsername = name;
      }
      await setDBUsername(initUsername);

      const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE}/events/${userId}`);
      
      eventSource.onmessage = (m) => {
        const event: Event = JSON.parse(m.data);
        switch (event.typ) {
          case "CHANGE_PLAYERS":
            const func = async () => {
              hostId = await fetchHost();
              setPlayers(event.players.map(p => {
                return {
                  username: p.username,
                  isMe: p.userId === userId,
                  isHost: p.userId === hostId,
                }
              }));
              if (event.state !== "PRE_START") {
                setCanJoin(true);
              }
            }
            func();
            break;

          case "GAME_FULL":
            const func2 = async () => {
              hostId = await fetchHost();
              setPlayers(event.players.map(p => {
                return {
                  username: p.username,
                  isMe: p.userId === userId,
                  isHost: p.userId === hostId,
                }
              }));
              if (event.state !== "PRE_START") {
                setCanJoin(true);
              }
            }
            func2();
            break;

          case "START_GAME":
            redirectToGame();
            break;
        }
      };
      return () => eventSource.close();
    };
    asyncFunc();
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

  const fetchHost = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/game/${id}/host`);
    const data = await res.json();

    const userId = getUserID();
    setIsHost(userId === data.host);

    return data.host;
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

  const copyGameLink = () => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/lobby/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
  }

  const saveUsername = () => {
    setUsernameLoading(true);
    setUsername(username.trim());
    setDBUsername(username.trim());
    localStorage.setItem("username", username.trim());
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
      <div className="w-full h-screen flex flex-col items-center">
        <Header />
        
        <div className="flex-grow flex items-center">
          <RoundedBox className="py-12 mb-12">
            <div className="w-full px-6 flex flex-col gap-1 items-center">
              <p className="font-semibold uppercase">
                Game ID:
              </p>
              <h1 className="text-5xl font-mono uppercase text-black">
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
                  className={`h-full w-48 p-1 text-center text-black rounded-xl text-xl
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
                  <div key={i} className="flex items-center border-2 border-slate-300
                      rounded-lg w-full px-2 bg-slate-100">
                    <p className="w-6 font-bold text-slate-500">
                      {i + 1}.
                    </p>
                    <p className={"text-black" + ((i < players.length && players[i].isMe) ? " font-bold" : "")}>
                      {i < players.length ? players[i].username : ""}
                    </p>
                    {(i < players.length && players[i].isHost && <p className="text-blue-500
                        rounded-lg uppercase ml-2 text-sm font-black">
                      Host
                    </p>)}
                  </div>
                )}
              </div>

              <Button
                size="lg"
                radius="lg"
                color="success"
                disabled={!isHost && !canJoin}
                isLoading={startLoading}
                onClick={canJoin ? redirectToGame : startGame}
                className={"w-full uppercase font-semibold text-2xl h-16"
                  + ((isHost || canJoin) ? "" : " bg-slate-400")}
              >
                {startLoading ? "Starting" : (canJoin ? "Join" :
                  (isHost ? "Start" : "Waiting for host"))}
              </Button>
            </div>
          </RoundedBox>
        </div>
      </div>
    </MainCenter>
  );
}
