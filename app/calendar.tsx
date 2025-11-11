"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
      events={[
        {
          title: "One-Punch Man",
          start: "2025-11-10T01:45:00",
          end: "2025-11-10T02:09:00",
          extendedProps: {
            subtitle: "Monster King",
            meta: "3x05 (29)",
            color: "#22c55e",
          },
        },
        {
          title: "Smiling Friends",
          start: "2025-11-10T15:30:00",
          end: "2025-11-10T15:41:00",
          extendedProps: {
            subtitle: "Pim & Charlie Save…",
            meta: "3x05",
            color: "#60a5fa",
          },
        },
      ]}
      eventContent={(arg) => {
        const { subtitle, meta, color } = arg.event.extendedProps;
        return (
          <div
            className="pl-2 overflow-x-hidden"
            style={{ borderLeft: `4px solid ${color || "#888"}` }}
          >
            <div className="text-sm font-medium leading-snug">
              {arg.event.title}
            </div>
            {subtitle && (
              <div className="text-xs opacity-80 truncate">{subtitle}</div>
            )}
            <div className="text-[11px] opacity-70 mt-0.5">
              {arg.timeText}
              {meta ? ` • ${meta}` : ""}
            </div>
          </div>
        );
      }}
    />
  );
}
