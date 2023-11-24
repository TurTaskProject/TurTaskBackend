import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const ApiUpdateUserProfile = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}user/update/`, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export { ApiUpdateUserProfile };
