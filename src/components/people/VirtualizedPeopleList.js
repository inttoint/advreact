import React, { Component } from "react";
import { fetchPeople, moduleName, peopleListSelector } from '../../ducks/people'
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'
import Loader from "../common/Loader";

class VirtualizedPeopleList extends Component {
  componentDidMount() {
    this.props.fetchPeople();
  }

  // ToDo: надо обновлять список людей
  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log()
    if (prevProps.people.length !== this.props.people.length) {
      this.props.fetchPeople();
      return true;
    }
    return false;
  }

  render() {
    const { people, loading } = this.props;

    if (loading) return <Loader />;

    return (
        <Table
          rowHeight={50}
          width={600}
          height={300}
          rowGetter={this.rowGetter}
          rowCount={people.length}
          headerHeight={50} >

          <Column label="firstName" width={200} dataKey="firstName" />
          <Column label="lastName" width={200} dataKey="lastName" />
          <Column label="email" width={200} dataKey="email" />
        </Table>
    );
  }

  rowGetter = ({ index }) => (this.props.people[index]);
}

export default connect(state => ({
  people: peopleListSelector(state),
  loading: state[moduleName].loading
}), { fetchPeople })(VirtualizedPeopleList);