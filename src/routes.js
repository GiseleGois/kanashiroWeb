import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './pages/home';
import Orders from './pages/orders';
import Login from './pages/login';
import Register from './pages/register';
import Products from './pages/products';
import ManagementUsers from './pages/manageUsers';
import UpdateOrder from './pages/update-order';
import newBilling from './pages/newBilling';
import BillingOptions from './pages/billingOptions';
import CheckInvoices from './pages/checkInvoices';
import PaymentInvoice from './pages/paymentInvoice';
import ConsolidatedInvoice from './pages/consolidatedInvoice';
import BillingDetail from './pages/billingDetail';
import CloseInvoice from './pages/invoice';
import ShowOrdersOfPasteis from './pages/showOrdersOfPasteis';
import ShowOrdersOfOthers from './pages/showOrdersOfOthers';

function Routes() {
  return (
    <Router>
      <Route path='/' exact component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/orders' component={Orders} />
      <Route path='/home' component={Home} />
      <Route path='/products' component={Products} />
      <Route path='/management-users' component={ManagementUsers} />
      <Route path='/update-order' component={UpdateOrder} />
      <Route path='/new-billing' component={newBilling}/>
      <Route path='/billing' component={BillingOptions}/>
      <Route path='/check-invoices' component={CheckInvoices}/>
      <Route path='/payment-invoice' component={PaymentInvoice}/>
      <Route path='/consolidated-invoice' component={ConsolidatedInvoice}/>
      <Route path='/billing-detail' component={BillingDetail} />
      <Route path='/invoice' component={CloseInvoice} />
      <Route path='/show-orders-of-pasteis' component={ShowOrdersOfPasteis} />
      <Route path='/show-orders-of-others' component={ShowOrdersOfOthers} />
    </Router>
  );
}

export default Routes;