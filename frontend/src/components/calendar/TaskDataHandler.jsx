import { readTodoTasks } from "../../api/TaskApi";

let eventGuid = 0;

const mapResponseToEvents = response => {
  return response.map(item => ({
    id: item.id,
    title: item.title,
    start: item.start_event,
    end: item.end_event,
  }));
};

export async function getEvents() {
  try {
    const response = await readTodoTasks();
    return mapResponseToEvents(response);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function createEventId() {
  return String(eventGuid++);
}
