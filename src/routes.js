import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './pages/home';
import Orders from './pages/orders';
import Login from './pages/login';
import Register from './pages/register';
import Products from './pages/products';
import ManageUsers from './pages/manageUser';
import UpdateOrder from './pages/update-order';
import Billing from './pages/billing';
import BillingDetail from './pages/billingDetail';
import CloseInvoice from './pages/invoice';

function Routes() {
  return (
    <Router>
      <Route path='/' exact component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/orders' component={Orders} />
      <Route path='/home' component={Home} />
      <Route path='/products' component={Products} />
      <Route path='/manage-users' component={ManageUsers} />
      <Route path='/update-order' component={UpdateOrder} />
      <Route path='/billing' component={Billing}/>
      <Route path='/billing-detail' component={BillingDetail} />
      <Route path='/invoice' component={CloseInvoice} />
    </Router>
  );
}

export default Routes;