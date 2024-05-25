import { Opponent } from "@/util/types";
import SmallWordleBoard from "./SmallWordleBoard";
import { ReactNode } from "react";
import SmallBoardSimple from "./SmallBoardSimple";


export default function Boards(props: {
  opponents: Opponent[],
  middle: ReactNode,
}) {
  const { opponents, middle } = props;

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
            <SmallBoardSimple opponents={opponents} i={0} />
          </div>
          {middle}
          <div className="flex flex-col w-36" />
        </div>
      );
    
    case 2:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} />
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
            <SmallBoardSimple opponents={opponents} i={1} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} />
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
            <SmallBoardSimple opponents={opponents} i={1} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} />
            <SmallBoardSimple opponents={opponents} i={3} />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} />
            <SmallBoardSimple opponents={opponents} i={2} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={3} />
            <SmallBoardSimple opponents={opponents} i={4} />
          </div>
          <div className="flex flex-col w-36" />
        </div>
      );

    case 6:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={1} />
            <SmallBoardSimple opponents={opponents} i={2} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={3} />
            <SmallBoardSimple opponents={opponents} i={4} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={5} />
          </div>
        </div>
      );

    case 7:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
            <SmallBoardSimple opponents={opponents} i={1} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} />
            <SmallBoardSimple opponents={opponents} i={3} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={4} />
            <SmallBoardSimple opponents={opponents} i={5} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={6} />
          </div>
        </div>
      );

    case 8:
      return (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={0} />
            <SmallBoardSimple opponents={opponents} i={1} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={2} />
            <SmallBoardSimple opponents={opponents} i={3} />
          </div>
          {middle}
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={4} />
            <SmallBoardSimple opponents={opponents} i={5} />
          </div>
          <div className="flex flex-col gap-4 w-36">
            <SmallBoardSimple opponents={opponents} i={6} />
            <SmallBoardSimple opponents={opponents} i={7} />
          </div>
        </div>
      );
  }
}