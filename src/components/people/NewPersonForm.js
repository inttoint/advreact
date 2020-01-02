import React from "react";
import { Field, reduxForm } from "redux-form";
import emailValidator from 'email-validator';
import ErrorField from "../common/ErrorField";

const NewPersonForm = (props) => {
  const { handleSubmit } = props;
  return (
    <div>
      <h2>Add new person</h2>
      <form onSubmit={handleSubmit}>
        <Field name="firstName" component={ErrorField} />
        <Field name="lastName" component={ErrorField} />
        <Field name="email" component={ErrorField} />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

const validate = ({ firstName, email }) => {
  const errors = {};

  if (!firstName) errors.firstName = 'First name is required';

  if (!email) errors.email = 'Email is required';
  else if (!emailValidator.validate(email)) errors.email= 'Email is invalid';

  return errors;

};

export default reduxForm({
  form: 'newPerson',
  validate
})(NewPersonForm);