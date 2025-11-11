"use client";

import { EventInput } from "@fullcalendar/core/index.js";
import { use, useState } from "react";

interface ShowCreatorProps {
  onCreate: (newEvents: EventInput[]) => void;
}

export default function ShowCreator({ onCreate }: ShowCreatorProps) {
  const [showName, setShowName] = useState<string>("");
  const [episodeCount, setEpisodeCount] = useState<number>(0);
  const [dateStart, setDateStart] = useState<string>("");

  return (
    <div className="flex gap-3 flex-col">
      <div>
        <label htmlFor="showName">Show Name:</label>
        <input
          type="text"
          id="showName"
          className="border rounded-sm ml-3"
          value={showName}
          onChange={(e) => {
            setShowName(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="episodeCount">Episodes:</label>
        <input
          type="number"
          id="episodeCount"
          className="border rounded-sm ml-3"
          value={episodeCount}
          onChange={(e) => {
            setEpisodeCount(Number(e.target.value || 0));
          }}
        />
      </div>
      <div>
        <label htmlFor="dateStartSelect">Date Start:</label>
        <input
          type="date"
          id="dateStartSelect"
          className="border rounded-sm ml-3"
          value={dateStart}
          onChange={(e) => {
            setDateStart(e.target.value);
          }}
        />
      </div>

      <input
        type="button"
        value="Add Show"
        className="border max-w-50 rounded-sm"
        onClick={() => {
          if (!showName.trim() || episodeCount <= 0 || !dateStart) {
            alert("Please fill in all fields correctly.");
            return;
          }
          onCreate(generateEvents(showName.trim(), episodeCount, dateStart));
        }}
      />
    </div>
  );
}

function generateEvents(
  showName: string,
  episodeCount: number,
  dateStart: string
): EventInput[] {
  const events: EventInput[] = [];
  const startDate = new Date(dateStart);

  for (let i = 0; i < episodeCount; i++) {
    const episodeDate = new Date(startDate);
    episodeDate.setDate(startDate.getDate() + i * 7); // Assuming weekly episodes

    events.push({
      title: `${showName} - Episode ${i + 1}`,
      start: episodeDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      allDay: true,
      extendedProps: {
        subtitle: `Episode ${i + 1}`,
        meta: `Season 1`,
        color: "#3498db",
      },
    });
  }

  return events;
}
