"use client"

import WordleBoard from "../WordleBoard";
import MainCenter from "@/app/MainCenter";


export default function Home() {
  return (
    <MainCenter>
      <WordleBoard word="slate" />
    </MainCenter>
  );
}
