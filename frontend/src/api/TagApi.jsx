import axiosInstance from "./configs/AxiosConfig";

export const fetchTags = () => {
  return axiosInstance
    .get("tags/")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};
