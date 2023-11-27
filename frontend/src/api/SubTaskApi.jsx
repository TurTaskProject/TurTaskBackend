import { axiosInstance } from "./AxiosConfig";

export const getSubtasks = async (parentTaskId) => {
  try {
    const response = await axiosInstance.get(`subtasks?parent_task=${parentTaskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }
};

export const addSubtask = async (parentTaskId, text) => {
  try {
    const response = await axiosInstance.post("subtasks/", {
      text,
      parent_task: parentTaskId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subtask:", error);
    throw error;
  }
};

export const deleteSubtask = async (subtaskId) => {
  try {
    await axiosInstance.delete(`subtasks/${subtaskId}/`);
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
};
