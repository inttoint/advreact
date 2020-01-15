import React, { Component } from "react";
import { fetchPeople, moduleName, peopleListSelector } from '../../ducks/people'
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'
import Loader from "../common/Loader";
import { TransitionMotion, spring } from "react-motion";

export class PeopleTable extends Component {
  componentDidMount() {
    this.props.fetchPeople();
  }

  render() {
    const {loading} = this.props;
    if (loading) return <Loader/>;

    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
      >
        {
          interpolatedStyles => (
            <Table
              rowHeight={50}
              width={600}
              height={300}
              rowGetter={({index}) => interpolatedStyles[index].data}
              rowCount={interpolatedStyles.length}
              rowStyle={({index}) => index > -1 ? interpolatedStyles[index].style : null}
              headerHeight={50}
              rowClassName="test--people-list__row">

              <Column label="FirstName" width={200} dataKey="firstName"/>
              <Column label="LastName" width={200} dataKey="lastName"/>
              <Column label="Email" width={200} dataKey="email"/>
            </Table>
          )
        }
      </TransitionMotion>
    );
  }

  getStyles() {
    return this.props.people.map(person => ({
      style: {
        opacity: spring(1, { stiffness: 50 }),
        left: spring(0, {stiffness: 70})
      },
      key: person.uid,
      data: person
    }));
  }

  willEnter = () => ({
    opacity: 0,
    left: -80
  });

}

export default connect(state => ({
  people: peopleListSelector(state),
  loading: state[moduleName].loading
}), { fetchPeople })(PeopleTable);