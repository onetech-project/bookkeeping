import React from 'react';
import Landing from '../pages/landing';
import Transaction from '../pages/transaction';
import { NavBar, Footer } from '../layout';

const getElement = (element, color) => (
  <>
    <NavBar color={color} />
    <div className='main-content'>
      {element}
    </div>
    <Footer color={color} />
  </>
)

const pages = [
  {
    path: '/',
    element: <div className='bg-body-darbuka-quarternary'>{getElement(<Landing />, 'light')}</div>
  },
  {
    path: 'transaction/:category',
    element: <div className='bg-body-darbuka-tertiary'>{getElement(<Transaction />, 'dark')}</div>
  }
]

export default pages;
