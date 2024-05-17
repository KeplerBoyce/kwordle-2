import { Button } from "@nextui-org/react";
import { useRef } from "react";

export default function KeyBox(props: {
  text: string,
  callback: () => void,
}) {
  const { text, callback } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
    callback();
  }

  return (
    <Button
      onClick={callback}
      ref={buttonRef}
      className="rounded-lg border-3 w-24 h-16 flex justify-center
        items-center text-lg font-semibold bg-transparent text-slate-500"
    >
      {text}
    </Button>
  );
}
