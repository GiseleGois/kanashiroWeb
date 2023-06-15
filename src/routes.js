import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './pages/home';
import Orders from './pages/orders';
import Login from './pages/login';
import Register from './pages/register';
import Billing from './pages/billing';
import Products from './pages/products';
import UpdateOrder from './pages/update-order';

function Routes() {
  return (
    <Router>
      <Route path='/' exact component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/orders' component={Orders} />
      <Route path='/home' component={Home} />
      <Route path='/billing' component={Billing} />
      <Route path='/products' component={Products} />
      <Route path='/update-order' component={UpdateOrder} />
    </Router>
  );
}

export default Routes;