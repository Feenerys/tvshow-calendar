'use client';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      }}
      buttonText={
        {today: "Today",
        month: "Month",
        week: "Week",
        day: "Day"
        }
      }
      events ={[
        { title: 'Event 1', date: '2025-11-11' },
        { title: 'Event 2', date: '2025-11-12' }
      ]}
    />
  )
}