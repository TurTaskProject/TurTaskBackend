import { useState, useEffect } from 'react';
import axiosapi from './axiosapi';

function IsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const access_token = localStorage.getItem('access_token');
      const refresh_token = localStorage.getItem('refresh_token');

      if (access_token && refresh_token) {
        const isAccessTokenExpired = checkIfAccessTokenExpired(access_token);

        if (!isAccessTokenExpired) {
          setIsAuthenticated(true);
        } else {
          try {
            // Attempt to refresh the access token using the refresh token
            const response = await axiosapi.refreshAccessToken(refresh_token);
            if (response.status === 200) {
              const newAccessToken = response.data.access_token;
              localStorage.setItem('access_token', newAccessToken);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const checkIfAccessTokenExpired = (accessToken) => {
    // Need to change logic again!
    return !accessToken;
  };

  return isAuthenticated;
}

export default IsAuthenticated;
