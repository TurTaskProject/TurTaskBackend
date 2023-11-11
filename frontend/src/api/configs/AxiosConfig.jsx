import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
});

// handling token refresh on 401 Unauthorized errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const refresh_token = localStorage.getItem('refresh_token');

        // Check if the error is due to 401 and a refresh token is available
        if (error.response.status === 401 && error.response.statusText === "Unauthorized" && refresh_token !== "undefined") {
            return axiosInstance
                .post('/token/refresh/', { refresh: refresh_token })
                .then((response) => {

                    localStorage.setItem('access_token', response.data.access);

                    axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
                    originalRequest.headers['Authorization'] = "Bearer " + response.data.access;

                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    console.log('Interceptors error: ', err);
                });
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
