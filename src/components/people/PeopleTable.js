import React, { Component } from "react";
import { fetchPeople, moduleName, peopleListSelector } from '../../ducks/people'
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'
import Loader from "../common/Loader";

export class PeopleTable extends Component {
  componentDidMount() {
    this.props.fetchPeople();
  }

  // ToDo: повторный рендеринг таблицы после добавления people

  render() {
    const { people, loading } = this.props;
    if (loading) return <Loader />;

    return (
        <Table
          rowHeight={50}
          width={600}
          height={300}
          rowGetter={({index}) => people[index]}
          rowCount={people.length}
          headerHeight={50}
          rowClassName="test--people-list__row" >

          <Column label="FirstName" width={200} dataKey="firstName" />
          <Column label="LastName" width={200} dataKey="lastName" />
          <Column label="Email" width={200} dataKey="email" />
        </Table>
    );
  }
}

export default connect(state => ({
  people: peopleListSelector(state),
  loading: state[moduleName].loading
}), { fetchPeople })(PeopleTable);