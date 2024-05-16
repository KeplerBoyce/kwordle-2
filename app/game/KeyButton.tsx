import { Char, WordleColor } from "@/util/types";
import { Button } from "@nextui-org/react";
import { Ref, useRef } from "react";


export default function KeyBox(props: {
  char: Char,
  color: WordleColor,
  callback: () => void,
}) {
  const { char, color, callback } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
    callback();
  }

  return (
    <Button
      onPress={handleClick}
      ref={buttonRef}
      size="sm"
      className={"rounded-lg border-3 min-w-12 w-12 h-16 flex justify-center items-center text-2xl font-semibold uppercase "
        + (color === "gray" ? "bg-wordle-gray border-wordle-gray text-white" :
          (color === "yellow" ? "bg-wordle-yellow border-wordle-yellow text-white" :
          (color === "green" ? "bg-wordle-green border-wordle-green text-white" :
          ("bg-transparent text-slate-500"))))}
    >
      {char}
    </Button>
  );
}
