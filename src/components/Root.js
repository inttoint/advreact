import React from "react";
import { Route } from 'react-router-dom';
import AdminPage from "./routes/AdminPage";
import AuthPage from "./routes/AuthPage";
import ProtectedRoute from "./common/ProtectedRoute";
import PeoplePage from "./routes/PersonPage";


const Root = () => {
  return (
    <div>
      <ProtectedRoute path="/admin" component={AdminPage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/people" component={PeoplePage} />
    </div>
  );
};

export default Root;