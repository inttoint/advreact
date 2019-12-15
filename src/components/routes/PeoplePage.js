import React, { Component } from "react";
import AddPersonForm from "../people/AddPersonForm";

class PeoplePage extends Component {
  render() {
    return (
      <div>
        <AddPersonForm onSubmit={this.handleAddedPerson} />
      </div>
    );
  }

  handleAddedPerson = (values) => console.log("---", values);
}

export default PeoplePage;