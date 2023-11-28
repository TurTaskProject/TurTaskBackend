import { axiosInstance } from "./AxiosConfig";

export const getSubtask = async (parentTaskId) => {
  try {
    const response = await axiosInstance.get(`subtasks?parent_task=${parentTaskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }
};

export const addSubtasks = async (parentTaskId, text) => {
  try {
    const response = await axiosInstance.post("subtasks/", {
      description: text,
      completed: false,
      parent_task: parentTaskId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subtask:", error);
    throw error;
  }
};

export const deleteSubtasks = async (subtaskId) => {
  try {
    await axiosInstance.delete(`subtasks/${subtaskId}/`);
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
};

export const updateSubtask = async (subtaskId, data) => {
  try {
    const response = await axiosInstance.patch(`subtasks/${subtaskId}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
};
