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
    <div className="flex flex-col gap-4 items-center">
      {textOverride
      ? <p className="text-5xl font-semibold">
        {textOverride}
      </p>
      : <p className={"text-5xl transition duration-150"
        + ((time < 10000 && time > 0) ? " text-red-500" : "")
        + (time <= 0 ? " text-3xl font-semibold" : " font-bold font-mono")
      }>
        {time <= 0 ? "Round ended!" : Math.ceil(time / 1000)}
      </p>}

      <div className="flex h-0">
        {time <= 0
          ? <div className="border border-slate-200" style={rightStyle} />
          : <>
            <div className={"border transition duration-150 "
              + ((time < 10000 && time > 0) ? "border-red-500" : "border-slate-500")
              } style={leftStyle}
            />
            <div className={"border transition duration-150 "
              + ((time < 10000 && time > 0) ? "border-red-200" : "border-slate-200")
              } style={rightStyle}
            />
          </>}
      </div>
    </div>
  );
}