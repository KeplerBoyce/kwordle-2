import { Button } from "@nextui-org/react";
import Link from "next/link";


export default function Header(props: { gameId?: string }) {
  const { gameId } = props;

  return (
    <div className="bg-white p-2 flex gap-12 w-full border-b-3 border-slate-200
        items-center justify-between text-black">
      <div className="w-full flex justify-end items-center">
        <Link href="/">
          <Button className="bg-slate-200 flex items-center">
            <p className="text-base font-bold uppercase">
              Back to menu
            </p>
          </Button>
        </Link>
      </div>

      <p className="text-3xl font-semibold w-min">
        Kwordle
      </p>

      <div className="w-full flex gap-1 items-center">
        <p className="text-2xl font-mono pt-2">
          {gameId ?? ""}
        </p>
      </div>
    </div>
  );
}
