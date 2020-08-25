import React, { Suspense } from 'react';
import { toast } from 'react-toastify';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import './App.css';
import './custom';
import login from './containers/login';

const Dashboard = React.lazy(() => import('./containers/dashboard'))
const MemberList = React.lazy(() => import('./containers/member-list'))
const MemberApprove = React.lazy(() => import('./containers/member-approve'))
const MemberPending = React.lazy(() => import('./containers/member-pending'))
const MemberBlock = React.lazy(() => import('./containers/member-block'))
const MemberDetails = React.lazy(() => import('./containers/member-details'))
const ContentManagement = React.lazy(() => import('./components/content-management'))
const Setting = React.lazy(() => import('./containers/setting'))
const Queries = React.lazy(() => import('./components/queries'))
const Reason = React.lazy(() => import('./components/reason'))
toast.configure()


function App() {

  let router = (
    <Switch>
      <Route exact path="/" component={login} />
      <Redirect to="/" />
    </Switch>
  );

  if (localStorage.getItem('token')) {
    router = (
      <Switch>
        <Route exect path="/dashboard" component={Dashboard} />
        <Route exect path="/member_list" component={MemberList} />
        <Route exect path="/member_approve" component={MemberApprove} />
        <Route exect path="/member_pending" component={MemberPending} />
        <Route exect path="/member_block" component={MemberBlock} />
        <Route exect path="/member_details/:id" component={MemberDetails} />
        <Route exect path="/content" component={ContentManagement} />
        <Route exect path="/setting" component={Setting} />
        <Route exect path="/queries" component={Queries} />
        <Route exect path="/reason" component={Reason} />
        <Redirect to="/dashboard" />
      </Switch>
    );
  }



  return (
    <React.Fragment>
      <BrowserRouter>
        <Suspense fallback={<div></div>}>
          {router}
        </Suspense>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;