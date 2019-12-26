import React from "react";
import NewPersonForm from "../people/NewPersonForm";
import { connect } from 'react-redux';
import { addPerson, moduleName } from '../../ducks/people';
import PeopleTable from "../people/PeopleTable";
import Loader from "../common/Loader";

const PersonPage = (props) => {
  const { loading, addPerson } = props;
  return (
    <div>
      <PeopleTable />
      <hr />
      { loading ? <Loader /> : <NewPersonForm onSubmit={addPerson} /> }
    </div>
  );
};

export default connect(state => ({
  loading: state[moduleName].loading
}), { addPerson })(PersonPage);