import React, { useEffect } from 'react';
import Navigation from './navigation';
import AOS from 'aos';
import moment from 'moment';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500
    });
    AOS.refresh();
    moment().locale('id');
  }, [])
  return (
    <Navigation />
  )
}

export default App;