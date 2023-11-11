import axios from 'axios';
import axiosInstance from './configs/AxiosConfig';

export const fetchTodoTasks = () => {
    return axiosInstance
        .get('todo/')
        .then((response) => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
};