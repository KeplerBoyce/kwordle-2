import { ReactNode } from "react";


export default function RoundedBox(props: {
  children?: ReactNode,
  className?: string,
}) {
  const { children, className } = props;
  
  return (
    <div className={`w-min flex flex-col items-center
      gap-6 bg-slate-200 rounded-3xl p-6` + (className ? " " + className : "")}>
      {children}
    </div>
  );
}
