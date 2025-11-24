"use client";

import Link from "next/link";
import ShowCreator from "./showCreator";
import { useEventStorage } from "../../lib/hooks/use-events";

export default function AddShowPage() {
  const { addEvents } = useEventStorage();
  const navItems = ["Series", "Calendar"];

  return (
    <div className="flex min-h-screen  text-white">
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
              className={`flex items-center justify-between rounded-2xl px-3 py-2 transition `}
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
        <main className="flex grow items-start justify-center p-10">
          <div className="w-full  rounded-3xl border border-zinc-900 bg-[#111111] p-8 shadow-lg">
            <ShowCreator onCreate={addEvents} />
            <p className="mb-6 text-sm text-zinc-400">
              Search for a show and queue its episodes directly into your
              calendar.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
