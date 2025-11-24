"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core/index.js";
import { EventClickArg } from "@fullcalendar/core/index.js";
interface CalendarProps {
  events: EventInput[];
  onEventClick: (event: EventClickArg) => void;
}

export default function Calendar({ events, onEventClick }: CalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      contentHeight="auto"
      buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
      events={events}
      editable
      eventContent={(arg) => {
        const { subtitle, meta, color } = arg.event.extendedProps;
        return (
          <div
            className="pl-2 mt-1 overflow-hidden text-foreground border-b border-b-gray-500/40"
            style={{ borderLeft: `4px solid ${color || "#888"}` }}
          >
            <div
              className="text-sm font-medium leading-snug text-ellipsis overflow-hidden whitespace-nowrap"
              title={arg.event.title}
            >
              {arg.event.title}
            </div>
            {subtitle && (
              <div
                className="text-xs  text-ellipsis overflow-hidden whitespace-nowrap"
                title={subtitle}
              >
                {subtitle}
              </div>
            )}
            <div className="text-[11px] mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">
              {arg.timeText}
              {meta ? ` • ${meta}` : ""}
            </div>
          </div>
        );
      }}
      eventClick={(info) => onEventClick(info)}
      
    />
  );
}
