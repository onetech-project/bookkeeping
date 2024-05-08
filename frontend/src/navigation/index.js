import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader } from '../components';
import { NavBar, Footer } from '../layout';
import pages from './pages';
import PageNotFound from '../pages/notfound';

const Navigation = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </Router>
  );
};

export default Navigation;