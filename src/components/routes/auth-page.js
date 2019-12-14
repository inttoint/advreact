import React, {Component} from "react";
import { SignInForm, SignUpForm } from "../auth";
import { Route, NavLink } from 'react-router-dom';

class AuthPage extends Component {

  handleSignIn = (values) => console.log("---", values);
  handleSignUp = (values) => console.log("---", values);

  render() {
    return (
      <div>
        <h2>Auth Page</h2>
        <NavLink to="/auth/signin" activeStyle={{color: "red"}}>sign in</NavLink>
        <NavLink to="/auth/signup" activeStyle={{color: "red"}}>sign up</NavLink>
        <Route path="/auth/signin" render={() => <SignInForm onSubmit={this.handleSignIn}/>}/>
        <Route path="/auth/signup" render={() => <SignUpForm onSubmit={this.handleSignUp}/>}/>
      </div>
    );
  }
}

export default AuthPage;