"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core/index.js";

interface CalendarProps {
  events: EventInput[];
}

export default function Calendar(events: CalendarProps) {


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
      events={events}
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
