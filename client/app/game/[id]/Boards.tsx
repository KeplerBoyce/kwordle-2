import { Opponent } from "@/util/types";
import SmallWordleBoard from "./SmallWordleBoard";
import { ReactNode } from "react";
import SmallBoardSimple from "./SmallBoardSimple";


export default function Boards(props: {
  opponents: Opponent[],
  middle: ReactNode,
  showLetters: boolean,
}) {
  const { opponents, middle, showLetters } = props;

  switch (opponents.length) {
    case 0:
      return (
        <div className="flex gap-8 items-center">
          {middle}
        </div>
      );
    
    case 1:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col w-36" />
        </div>
      );
    
    case 2:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={3} showLetters={showLetters} />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={3} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={4} showLetters={showLetters} />
          </div>
          <div className="flex flex-col w-36" />
        </div>
      );

    case 6:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={3} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={4} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={5} showLetters={showLetters} />
          </div>
        </div>
      );

    case 7:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={3} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={4} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={5} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={6} showLetters={showLetters} />
          </div>
        </div>
      );

    case 8:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={1} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={3} showLetters={showLetters} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={4} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={5} showLetters={showLetters} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={6} showLetters={showLetters} />
            <SmallBoardSimple opponents={opponents} i={7} showLetters={showLetters} />
          </div>
        </div>
      );
  }
}