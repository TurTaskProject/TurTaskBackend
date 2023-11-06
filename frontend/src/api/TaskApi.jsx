import axios from 'axios';

// Create an Axios instance with common configurations
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json',
    }
});

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