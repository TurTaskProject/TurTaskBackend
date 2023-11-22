import axiosInstance from "src/api/AxiosConfig";

const baseURL = "";

export const createTask = (endpoint, data) => {
  return axiosInstance
    .post(`${baseURL}${endpoint}/`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const readTasks = (endpoint) => {
  return axiosInstance
    .get(`${baseURL}${endpoint}/`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const readTaskByID = (endpoint, id) => {
  return axiosInstance
    .get(`${baseURL}${endpoint}/${id}/`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const updateTask = (endpoint, id, data) => {
  return axiosInstance
    .put(`${baseURL}${endpoint}/${id}/`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const deleteTask = (endpoint, id) => {
  return axiosInstance
    .delete(`${baseURL}${endpoint}/${id}/`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

// Create
export const createTodoTask = (data) => createTask("todo", data);
export const createRecurrenceTask = (data) => createTask("daily", data);
export const createHabitTask = (data) => createTask("habit", data);

// Read
export const readTodoTasks = () => readTasks("todo");
export const readRecurrenceTasks = () => readTasks("daily");
export const readHabitTasks = () => readTasks("habit");

// Read by ID
export const readTodoTaskByID = (id) => readTaskByID("todo", id);
export const readRecurrenceTaskByID = (id) => readTaskByID("daily", id);
export const readHabitTaskByID = (id) => readTaskByID("habit", id);

// Update
export const updateTodoTask = (id, data) => updateTask("todo", id, data);
export const updateRecurrenceTask = (id, data) => updateTask("daily", id, data);
export const updateHabitTask = (id, data) => updateTask("habit", id, data);

// Delete
export const deleteTodoTask = (id) => deleteTask("todo", id);
export const deleteRecurrenceTask = (id) => deleteTask("daily", id);
export const deleteHabitTask = (id) => deleteTask("habit", id);
