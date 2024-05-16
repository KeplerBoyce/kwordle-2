import { ReactNode } from "react";


export default function RoundedBox(props: { children?: ReactNode }) {
  const { children } = props;
  
  return (
    <div className="flex flex-col items-center gap-6 bg-gray-200 rounded-3xl p-12">
      {children}
    </div>
  );
}
