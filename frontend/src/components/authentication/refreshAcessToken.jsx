import axios from 'axios';

async function refreshAccessToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    return true;
  }

  if (!refresh_token) {
    return false;
  }

  const refreshUrl = 'http://127.0.0.1:8000/api/token/refresh/';

  try {
    const response = await axios.post(refreshUrl, { refresh: refresh_token });

    if (response.status === 200) {
      // Successful refresh - save the new access token and refresh token
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export default refreshAccessToken;
