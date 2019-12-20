import React from "react";
import { Link, Route } from 'react-router-dom';
import AdminPage from "./routes/AdminPage";
import AuthPage from "./routes/AuthPage";
import ProtectedRoute from "./common/ProtectedRoute";
import PersonPage from "./routes/PersonPage";
import EventsPage from "./routes/EventsPage";
import { connect } from "react-redux";
import { moduleName, signOut } from  '../ducks/auth'


const Root = (props) => {
  const { signedIn, signOut } = props;
  const btn = signedIn
    ? <button onClick={signOut}>Sign out</button>
    : <Link to="/auth/signin">Sign in</Link>;
  return (
    <div>
      { btn }
      <ProtectedRoute path="/admin" component={AdminPage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/people" component={PersonPage} />
      <Route path="/events" component={EventsPage} />
    </div>
  );
};

export default connect(state => ({
  signedIn: !!state[moduleName].user
}), { signOut }/*, null, {pure: false}*/)(Root);