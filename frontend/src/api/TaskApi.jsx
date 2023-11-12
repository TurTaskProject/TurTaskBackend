import axiosInstance from "./configs/AxiosConfig";

export const fetchTodoTasks = () => {
  return axiosInstance
    .get("todo/")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

export const fetchTodoTasksID = id => {
  return axiosInstance
    .get(`todo/${id}/`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};
