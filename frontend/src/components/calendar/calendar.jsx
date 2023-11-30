import React, { useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents, createEventId } from "./TaskDataHandler";
import { axiosInstance } from "src/api/AxiosConfig";

export class Calendar extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
  };

  async handleGoogleClick() {
    try {
      const response = await axiosInstance.get("calendar-events/");
    } catch (error) {
      console.error("Error fetching data from Google:", error);
    }
  }

  render() {
    return (
      <div className="flex font-sans w-full h-screen">
        {this.renderSidebar()}
        <div className="flex-grow p-16 overflow-y-auto h-full max-h-screen">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={getEvents}
            // select={this.handleDateSelect}
            eventContent={renderEventContent}
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents}
          />
        </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="w-72 bg-blue-100 border-r border-blue-200 p-8 flex flex-col">
        {/* Description Zone */}
        <div className="mb-8">
          <ul className="list-disc pl-4">
            <li>Click an event to delete it</li>
          </ul>
        </div>

        {/* Toggle */}
        <div className="mb-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
              className="mr-2 mb-4"
            />
            Toggle weekends
          </label>
          <button className="btn btn-info" onClick={() => this.handleGoogleClick()}>
            Load Data from Google
          </button>
        </div>

        {/* Show all task */}
        <div className="overflow-y-auto">
          <h2 className="text-xl font-bold">All Events ({this.state.currentEvents.length})</h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  // handleDateSelect = (selectInfo) => {
  //   let title = prompt("Please enter a new title for your event");
  //   let calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     });
  //   }
  // };

  handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      axiosInstance
        .delete(`todo/${clickInfo.event.id}/`)
        .then((response) => {
          clickInfo.event.remove();
        })
        .catch((error) => {
          console.error("Error deleting Task:", error);
        });
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: "numeric", month: "short", day: "numeric" })}</b>
      <i>{event.title}</i>
    </li>
  );
}
