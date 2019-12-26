import React, { Component } from "react";
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import PersonCard from "./PersonCard";
import {fetchPeople, peopleListSelector} from "../../ducks/people";

class PeopleList extends Component {
  componentDidMount() {
    this.props.fetchPeople();
  }

  render() {
    const { people } = this.props;
    return (
      <List
        height={300}
        width={200}
        rowCount={people.length}
        rowHeight={100}
        rowRenderer={this.rowRenderer} />
    );
  }

  rowRenderer = ({ index, style, key}) => {
    return <PersonCard
      person={this.props.people[index]}
      key={key}
      style={style}/>
  };

}

export default connect(state => ({
  people: peopleListSelector(state)
}), { fetchPeople })(PeopleList);