import React from "react";
import { reduxForm, Field } from 'redux-form';

const SignInForm = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component="input" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Field name="password" component="input" type="password" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default reduxForm({
  form: 'auth'
})(SignInForm);