"use client";

import Image from "next/image";
import Calendar from "./calendar";
import ShowCreator from "./showCreator";
import { useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";


export default function Home() {
  const [events, setEvents] = useState<EventInput[]>([]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black gap-5">
      <main className="mt-5 h-full w-full max-w-4xl rounded-lg bg-white p-10 shadow-lg dark:bg-zinc-900">
       <Calendar events={events}/>
      </main>
      <main className="mt-5 h-full w-full max-w-xl rounded-lg bg-white p-10 shadow-lg dark:bg-zinc-900">
        <ShowCreator onCreate={(newEvents) => setEvents(prev => [...prev, ...newEvents])}/>
      </main>
    </div>
  );
}
