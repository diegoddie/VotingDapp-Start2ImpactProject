import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HideNavbar = ({ children }) => {
  const location = useLocation();

  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    const isPathMatch =
      location.pathname !== '/' &&
      !location.pathname.startsWith('/candidates') &&
    setHideNavbar(isPathMatch);
  }, [location.pathname]);

  return <div>{!hideNavbar && children}</div>;
};

export default HideNavbar;
