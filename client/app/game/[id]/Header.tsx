import { Button } from "@nextui-org/react";
import Link from "next/link";


export default function Header() {
  return (
    <div className="p-4 flex w-full border-b-3 border-slate-200 items-center justify-between text-black">

      <div className="w-1/4">
        <Link href="/">
          <Button className="bg-transparent flex items-center">
            <p className="text-base font-bold uppercase">
              Back to menu
            </p>
          </Button>
        </Link>
      </div>

      <p className="text-3xl font-semibold">
        Kwordle
      </p>

      <div className="w-1/4" />
    </div>
  );
}