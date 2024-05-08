import React from 'react';
import Landing from '../pages/landing';
import Transaction from '../pages/transaction';

const pages = [
  {
    path: '/',
    element: <Landing />
  },
  {
    path: 'transaction/:category',
    element: <Transaction />
  }
]

export default pages;
