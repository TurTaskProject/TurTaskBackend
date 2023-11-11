import axios from "axios";
import axiosInstance from "./configs/AxiosConfig";

// Function for user login
const apiUserLogin = data => {
  return axiosInstance
    .post("token/obtain/", data)
    .then(response => {
      console.log(response.statusText);
      return response;
    })
    .catch(error => {
      console.log("apiUserLogin error: ", error);
      return error;
    });
};

// Function for user logout
const apiUserLogout = () => {
  axiosInstance.defaults.headers["Authorization"] = ""; // Clear authorization header
  localStorage.removeItem("access_token"); // Remove access token
  localStorage.removeItem("refresh_token"); // Remove refresh token
};

// Function for Google login
const googleLogin = async token => {
  axios.defaults.withCredentials = true;
  let res = await axios.post("http://localhost:8000/api/auth/google/", {
    code: token,
  });
  // console.log('service google login res: ', res);
  return await res;
};

// Function to get 'hello' data
const getGreeting = () => {
  return axiosInstance
    .get("hello")
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
};

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Function to register
const createUser = async formData => {
  try {
    axios.defaults.withCredentials = true;
    const resposne = axios.post("http://localhost:8000/api/user/create/", formData);
    // const response = await axiosInstance.post('/user/create/', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export the functions and Axios instance
export default {
  apiUserLogin,
  apiUserLogout,
  getGreeting: getGreeting,
  googleLogin,
  createUser,
};
