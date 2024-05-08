import React, { Suspense, createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader } from '../components';
import { NavBar, Footer } from '../layout';
import pages from './pages';
import PageNotFound from '../pages/notfound';

export const LoggedInContext = createContext();

const Navigation = () => {
  const [loggedIn, setLoggedIn] = useState();
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, [])
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
          <NavBar />
            <div style={{ height: '80.5vh' }}>
              <Routes>
                {pages.map((x) => (
                  <Route key={x.path} path={x.path} element={x.element} />
                ))}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          <Footer />
        </LoggedInContext.Provider>
      </Suspense>
    </Router>
  );
};

export default Navigation;