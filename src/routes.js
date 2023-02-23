import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

function Routes() {
  return (
    <Router>
      <Route path='/' exact component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/home' component={Home} />
    </Router>
  );
}

export default Routes;