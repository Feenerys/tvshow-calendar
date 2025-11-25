"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core/index.js";
import { EventClickArg, EventDropArg } from "@fullcalendar/core/index.js";
import { Button, Modal } from "@mantine/core";

type DropScope = "all" | "single" | "continuing";

interface CalendarProps {
  events: EventInput[];
  onEventClick: (event: EventClickArg) => void;
}

export default function Calendar({ events, onEventClick }: CalendarProps) {
  const [pendingDrop, setPendingDrop] = useState<EventDropArg | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const relatedEvents = pendingDrop?.relatedEvents ?? [];
  const currentStartTime = pendingDrop?.event?.start?.getTime();
  const continuingCount = relatedEvents.filter((relatedEvent) => {
    const relatedStartTime = relatedEvent.start?.getTime();
    return (
      typeof relatedStartTime === "number" &&
      typeof currentStartTime === "number" &&
      relatedStartTime > currentStartTime
    );
  }).length;

  const handleCloseModal = () => {
    pendingDrop?.revert();
    setPendingDrop(null);
    setModalOpened(false);
  };

  //TODO: figure out a way to move individual episodes
  const handleConfirmDrop = (scope: DropScope) => {
    if (!pendingDrop) return;

    const scopeMessage =
      scope === "all"
        ? "all events"
        : scope === "continuing"
        ? "all continuing events"
        : "this event only";

    if (scope !== "all") {
      const delta = pendingDrop.delta;
      const dropStartTime = pendingDrop.event.start?.getTime();
      const allScopedEvents = Array.from(
        new Set([pendingDrop.event, ...pendingDrop.relatedEvents])
      );

      const eventsToKeep =
        scope === "single"
          ? [pendingDrop.event]
          : allScopedEvents.filter((event) => {
              const startTime = event.start?.getTime();
              return (
                typeof startTime === "number" &&
                typeof dropStartTime === "number" &&
                startTime >= dropStartTime
              );
            });

      pendingDrop.revert();
      eventsToKeep.forEach((event) => event.moveDates(delta));
    }

    setPendingDrop(null);
    setModalOpened(false);
  };

  const handleDrop = (info: EventDropArg) => {
    setPendingDrop(info);
    setModalOpened(true);
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={`Change date for ${pendingDrop?.event.title}`}
        centered
      >
        <p className="text-sm text-zinc-400">
          {relatedEvents.length
            ? `This show has ${relatedEvents.length} related appearance${
                relatedEvents.length === 1 ? "" : "s"
              }${
                continuingCount
                  ? ` and ${continuingCount} continuing event${
                      continuingCount === 1 ? "" : "s"
                    }`
                  : ""
              }.`
            : "No related events, so only this event will move."}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {relatedEvents.length ? (
            <>
              <Button
                fullWidth
                onClick={() => handleConfirmDrop("all")}
                color="grape"
              >
                Change all events ({relatedEvents.length})
              </Button>
              {/* <Button
                fullWidth
                variant="outline"
                onClick={() => handleConfirmDrop("single")}
                color="grape"
              >
                Change this event only
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => handleConfirmDrop("continuing")}
                color="grape"
              >
                Change all continuing events ({continuingCount})
              </Button> */}
            </>
          ) : (
            <Button fullWidth onClick={() => handleConfirmDrop("single")}>
              Change this event only
            </Button>
          )}
          <Button fullWidth variant="default" onClick={handleCloseModal}>
            Revert change
          </Button>
        </div>
      </Modal>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        contentHeight="auto"
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        events={events}
        editable
        eventDurationEditable={false}
        eventContent={(info) => {
          const { name, season, number, absNumber, color } =
            info.event.extendedProps;
          return (
            <div
              className="p-2 pl-1  mt-1 overflow-hidden text-foreground border-b border-b-gray-500/40 flex flex-col gap-0.5"
              style={{ borderLeft: `4px solid ${color || "#888"}` }}
            >
              <div
                className="text-md font-bold leading-snug text-ellipsis overflow-hidden whitespace-nowrap"
                title={info.event.title}
              >
                {info.event.title}
              </div>
              <div className="flex flex-col text-xs justify-between gap-0.5">
                {name && (
                  <div
                    className="flex-1 font-medium text-ellipsis overflow-hidden whitespace-nowrap"
                    title={name}
                  >
                    {name}
                  </div>
                )}
                <div className="">
                  {info.timeText}
                  {season ? `${season}` : ""}x
                  {number ? `${String(number).padStart(2, "0")}` : ""}
                  {absNumber ? `(${absNumber})` : ""}
                </div>
              </div>
            </div>
          );
        }}
        eventClick={(info) => onEventClick(info)}
        eventDrop={handleDrop}
      />
    </>
  );
}
