import { useEffect, useState } from "react";


export default function Timer(props: { time: number }) {
  const { time } = props;

  const [leftStyle, setLeftStyle] = useState({
    width: "300px"
  });
  const [rightStyle, setRightStyle] = useState({
    width: "0px"
  });

  useEffect(() => {
    setLeftStyle({
      width: `${300 * time / 60}px`
    });
    setRightStyle({
      width: `${300 - (300 * time / 60)}px`
    });
  }, [time]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className={"text-5xl font-bold font-mono"
        + (time < 10 ? " text-red-500" : "")
      }>
        {time}
      </h1>
      <div className="flex h-0">
        <div className="border border-slate-500" style={leftStyle} />
        <div className="border border-slate-200" style={rightStyle} />
      </div>
    </div>
  );
}