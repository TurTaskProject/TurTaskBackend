import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = () => {
  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: 'Event 1', date: '2023-11-10' },
          { title: 'Event 2', date: '2023-11-15' },
          { title: 'Event 2', date: '2023-11-15' },
        ]}
        headerToolbar={{
          start: 'prev,next',
          center: "title",
          end: 'timeGridDay,dayGridMonth,timeGridWeek,',
          
        }}
      />
    </div>
  );
};

export default Calendar;
