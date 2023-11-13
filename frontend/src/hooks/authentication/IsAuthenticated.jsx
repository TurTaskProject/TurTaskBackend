import { useEffect, useState } from 'react';

function IsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const access_token = localStorage.getItem('access_token');
    return !!access_token;
  });

  useEffect(() => {
    const handleTokenChange = () => {
      const newAccessToken = localStorage.getItem('access_token');
      setIsAuthenticated(!!newAccessToken);
    };

    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []);

  return isAuthenticated;
}

export default IsAuthenticated;
