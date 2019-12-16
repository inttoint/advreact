import React, { Component } from "react";
import AddPersonForm from "../people/AddPersonForm";
import { connect } from 'react-redux';
import { addPerson } from '../../ducks/people';

class PeoplePage extends Component {
  render() {
    return (
      <div>
        <AddPersonForm onSubmit={this.handleAddedPerson} />
      </div>
    );
  }

  handleAddedPerson = ({ firstName, lastName, email }) => this.props.addPerson(firstName, lastName, email);
}

export default connect(null, {addPerson})(PeoplePage);