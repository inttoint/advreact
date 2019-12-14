import React from "react";
import { Route } from 'react-router-dom';
import { AdminPage, AuthPage} from '../routes'


const Root = () => {
  return (
    <div>
      <Route path="/admin" component={AdminPage}/>
      <Route path="/auth" component={AuthPage}/>
    </div>
  );
};

export default Root;