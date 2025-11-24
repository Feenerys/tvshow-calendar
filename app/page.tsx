"use client";

import Link from "next/link";
import { useState } from "react";
import Calendar from "./calendar";
import { EventImpl } from "@fullcalendar/core/internal";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEventStorage } from "../lib/hooks/use-events";

const navItems = ["Series", "Calendar"];

export default function Home() {
  const { events, setEvents } = useEventStorage();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeEvent, setActiveEvent] = useState<EventImpl | null>(null);

  const handleDeleteEvent = () => {
    if (!activeEvent) return;
    setEvents((prev) =>
      prev.filter(
        (event) =>
          event.title !== activeEvent.title ||
          event.start !== activeEvent.startStr
      )
    );
    close();
  };

  return (
    <div className="flex min-h-screen  text-white">
      <Modal opened={opened} onClose={close} title={activeEvent?.title}>
        <Button onClick={handleDeleteEvent}>Delete</Button>
      </Modal>

      <aside className="flex w-60 flex-col gap-6 border-r border-zinc-900 bg-[#1a1a1a] px-6 py-8">
        <div className="flex flex-col gap-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-[#101010]">
            <span className="text-xl font-semibold text-white/80">TK</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3rem] text-zinc-500">
              tvshow
            </p>
            <p className="text-sm font-semibold text-white">Calendar</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-3 text-sm text-zinc-400">
          {navItems.map((item) => (
            <Link
              key={item}
              href="/"
              className={`flex items-center justify-between rounded-2xl px-3 py-2 transition ${
                item === "Calendar"
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5"
              }`}
            >
              <span>{item}</span>
            </Link>
          ))}
          <Link
            href="/add-show"
            className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2rem] text-white"
          >
            Add show
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* <header className="flex flex-col gap-5 border-b border-zinc-900 bg-[#151515] px-8 py-6 shadow-sm">
          
        </header> */}

        <main className="flex flex-col max-h-[calc(100vh)] overflow-auto p-6">
          <Calendar
            events={events}
            onEventClick={(event) => {
              setActiveEvent(event.event);
              open();
            }}
          />
        </main>
      </div>
    </div>
  );
}
