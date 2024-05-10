import React, { Suspense, createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader, Toast } from '../components';
import { NavBar, Footer } from '../layout';
import pages from './pages';
import PageNotFound from '../pages/notfound';

export const AppContext = createContext();

const Navigation = () => {
  const [loggedIn, setLoggedIn] = useState();
  
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, [])
  
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <AppContext.Provider value={{ loggedIn, setLoggedIn }}>
          <Routes>
            {pages.map((x) => (
              <Route key={x.path} path={x.path} element={x.element} />
            ))}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toast />
        </AppContext.Provider>
      </Suspense>
    </Router>
  );
};

export default Navigation;