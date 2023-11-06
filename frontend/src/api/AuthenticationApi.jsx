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

// Add a response interceptor to handle token refresh on 401 Unauthorized errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const refresh_token = localStorage.getItem('refresh_token');

        // Check if the error is due to Unauthorized (401) and a refresh token is available
        if (error.response.status === 401 && error.response.statusText === "Unauthorized" && refresh_token !== "undefined") {
            return axiosInstance
                .post('/token/refresh/', { refresh: refresh_token })
                .then((response) => {
                    // Update access and refresh tokens
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);

                    // Update the authorization header with the new access token
                    axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
                    originalRequest.headers['Authorization'] = "Bearer " + response.data.access;

                    return axiosInstance(originalRequest); // Retry the original request
                })
                .catch(err => {
                    console.log('Interceptors error: ', err);
                });
        }
        return Promise.reject(error);
    }
);

// Function for user login
const apiUserLogin = (data) => {
    return axiosInstance
        .post('token/obtain/', data)
        .then((response) => {
            console.log(response.statusText);
            return response;
        }).catch(error => {
            console.log('apiUserLogin error: ', error);
            return error;
        });
};

// Function for user logout
const apiUserLogout = () => {
    axiosInstance.defaults.headers['Authorization'] = ""; // Clear authorization header
    localStorage.removeItem('access_token'); // Remove access token
    localStorage.removeItem('refresh_token'); // Remove refresh token
}

// Function for Google login
const googleLogin = async (token) => {
    axios.defaults.withCredentials = true
    let res = await axios.post(
        "http://localhost:8000/api/auth/google/",
        {
            code: token,
        }
    );
    // console.log('service google login res: ', res);
    return await res;
};


// Function to get 'hello' data
const getGreeting = () => {
    return axiosInstance
        .get('hello')
        .then((response) => {
            return response;
        }).catch(error => {
            return error;
        });
}

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};

// Function to register
const createUser = async (formData) => {
  try {
    axios.defaults.withCredentials = true
    const resposne = axios.post("http://localhost:8000/api/user/create/", formData);
    // const response = await axiosInstance.post('/user/create/', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Export the functions and Axios instance
export default {
    axiosInstance,
    apiUserLogin,
    apiUserLogout,
    getGreeting: getGreeting,
    googleLogin,
    createUser
};
