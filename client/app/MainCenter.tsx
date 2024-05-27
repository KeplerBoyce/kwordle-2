import { ReactNode } from "react";


export default function MainCenter(props: { children?: ReactNode }) {
  const { children } = props;
  
  return (
    <main className="flex justify-center items-center min-h-screen text-slate-500">
      <div className="flex justify-center items-center w-screen w-full h-full">
        {children}
      </div>
    </main>
  );
}
