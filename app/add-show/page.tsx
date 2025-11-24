"use client";

import Link from "next/link";
import ShowCreator from "./showCreator";
import { useEventStorage } from "../../lib/hooks/use-events";

export default function AddShowPage() {
  const { addEvents } = useEventStorage();

  return (
    <div className="flex min-h-screen flex-col  text-white">
      <header className="border-b border-zinc-900 bg-[#111111]/80 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3rem] text-zinc-500">add show</p>
            <h1 className="text-2xl font-semibold">Plan a season</h1>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Back to calendar
          </Link>
        </div>
      </header>

      <main className="flex grow items-center justify-center p-10">
        <div className="w-full max-w-3xl rounded-3xl border border-zinc-900 bg-[#111111] p-8 shadow-lg">
          <p className="mb-6 text-sm text-zinc-400">
            Search for a show and queue its episodes directly into your calendar.
          </p>
          <ShowCreator onCreate={addEvents} />
        </div>
      </main>
    </div>
  );
}
