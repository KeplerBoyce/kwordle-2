import { useEffect, useState } from "react";


export default function Timer(props: {
  time: number,
  duration: number,
  width: number,
  textOverride?: string,
}) {
  const { time, duration, width, textOverride } = props;

  const [leftStyle, setLeftStyle] = useState({
    width: `${width}px`
  });
  const [rightStyle, setRightStyle] = useState({
    width: "0px"
  });

  useEffect(() => {
    setLeftStyle({
      width: `${Math.floor(width * time / duration)}px`
    });
    setRightStyle({
      width: `${Math.min(width, Math.ceil(width - (width * time / duration)))}px`
    });
  }, [time]);

  return (
    <div className="flex flex-col gap-4 items-center text-black">
      <div className="flex items-center justify-center h-12">
        <p className={"transition duration-150 "
          + (textOverride ? "text-3xl uppercase font-bold" : "text-5xl font-mono")
          + ((time < 10000 && time > 0) ? " text-red-500" : "")
        }>
          {textOverride ?? Math.ceil(time / 1000)}
        </p>
      </div>

      <div className="flex h-1">
        {time <= 0
          ? <div className="bg-slate-300" style={rightStyle} />
          : <>
            <div className={"transition duration-150 "
              + ((time < 10000 && time > 0) ? "bg-red-500" : "bg-slate-500")
              } style={leftStyle}
            />
            <div className={"transition duration-150 "
              + ((time < 10000 && time > 0) ? "bg-red-200" : "bg-slate-300")
              } style={rightStyle}
            />
          </>}
      </div>
    </div>
  );
}