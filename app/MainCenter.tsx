import { ReactNode } from "react";


export default function MainCenter(props: { children?: ReactNode }) {
  const { children } = props;
  
  return (
    <main className="flex justify-center items-center min-h-screen">
      {children}
    </main>
  );
}
