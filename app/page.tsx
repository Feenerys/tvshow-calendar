"use client";

import Image from "next/image";
import Calendar from "./calendar";
import ShowCreator from "./showCreator";
import { useState, useEffect } from "react";
import { EventInput } from "@fullcalendar/core/index.js";
import { Button } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export default function Home() {
  const [events, setEvents] = useState<EventInput[]>(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black text-foreground gap-5">
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>
      <main className="mt-5 h-full w-full max-w-4xl rounded-lg bg-white p-10 shadow-lg dark:bg-zinc-900">
        <Calendar events={events} onEventClick={open} />
      </main>
      <main className="flex flex-col gap-4 mt-5 h-full w-full max-w-xl rounded-lg bg-white p-10 shadow-lg dark:bg-zinc-900">
        <ShowCreator
          onCreate={(newEvents) => setEvents((prev) => [...prev, ...newEvents])}
        />
        <Button
          onClick={() => {
            localStorage.removeItem("events");
            setEvents([]);
          }}
          className="border rounded-sm px-2 py-1"
        >
          Clear All
        </Button>
      </main>
    </div>
  );
}
