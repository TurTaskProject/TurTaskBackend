import { fetchTodoTasks } from '../../api/TaskApi';

let eventGuid = 0

// function getDateAndTime(dateString) {
//   const dateObject = new Date(dateString);

//   const year = dateObject.getFullYear();
//   const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
//   const day = dateObject.getDate().toString().padStart(2, '0');
//   const dateFormatted = `${year}-${month}-${day}`;

//   const hours = dateObject.getUTCHours().toString().padStart(2, '0');
//   const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
//   const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');
//   const timeFormatted = `T${hours}:${minutes}:${seconds}`;

//   return dateFormatted + timeFormatted;
// }

const mapResponseToEvents = (response) => {
    return response.map(item => ({
        id: createEventId(),
        title: item.title,
        start: item.start_event,
        end: item.end_event,
    }));
}

export async function getEvents() {
    try {
        const response = await fetchTodoTasks();
        return mapResponseToEvents(response);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function createEventId() {
    return String(eventGuid++);
}