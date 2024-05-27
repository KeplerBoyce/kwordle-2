import { Button } from "@nextui-org/react";
import Link from "next/link";


export default function Header() {
  return (
    <div className="bg-white p-2 flex gap-12 w-full border-b-3 border-slate-200 items-center justify-between text-black">

      <div className="w-full flex justify-end">
        <Link href="/">
          <Button className="bg-transparent flex items-center">
            <p className="text-base font-bold uppercase">
              Back to menu
            </p>
          </Button>
        </Link>
      </div>

      <p className="text-3xl font-semibold w-min">
        Kwordle
      </p>

      <div className="w-full" />
    </div>
  );
}
