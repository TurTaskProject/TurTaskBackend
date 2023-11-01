import { useState, useEffect } from 'react';

function IsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
}

export default IsAuthenticated;