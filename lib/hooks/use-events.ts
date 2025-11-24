"use client";

import { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";

export function useEventStorage() {
  const [events, setEvents] = useState<EventInput[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("events");
    return saved ? (JSON.parse(saved) as EventInput[]) : [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvents = (newEvents: EventInput[]) => {
    if (newEvents.length === 0) return;
    setEvents((prev) => [...prev, ...newEvents]);
  };

  return { events, setEvents, addEvents };
}
