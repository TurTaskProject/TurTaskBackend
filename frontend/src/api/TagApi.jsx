import { createTask, readTasks, readTaskByID, updateTask, deleteTask } from "./TaskApi";

// CRUD functions for "tags" endpoint
export const createTag = data => createTask("tags", data);
export const readTags = () => readTasks("tags");
export const readTagByID = id => readTaskByID("tags", id);
export const updateTag = (id, data) => updateTask("tags", id, data);
export const deleteTag = id => deleteTask("tags", id);
