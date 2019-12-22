import React, { Component } from "react";
import { fetchPeople, moduleName, peopleListSelector } from '../../ducks/people'
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css'
import Loader from "../common/Loader";

class VirtualizedPeopleList extends Component {
  componentDidMount() {
    this.props.fetchPeople();
  }

  // ToDo: надо обновлять список людей
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.people.length !== this.props.people.length) {
  //     this.props.fetchPeople();
  //   }
  // }

  render() {
    const { people, loading } = this.props;

    // console.log('-->', people.length);
    if (loading) return <Loader />;

    return (
      <div>
        <h2>People List</h2>
          <List
            ref="List"
            height={300}
            width={700}
            rowHeight={50}
            rowCount={people.length}
            rowRenderer={this.rowRenderer}
          />
      </div>
    );
  }

  rowRenderer = ({ index, key, style }) => {
    const { people } = this.props;

    return (
     <div key={key} className="row" style={style} >
       <div className="content">
         <div>
           <span>{`${people[index].firstName} ${people[index].lastName}`}</span>
         </div>
         <div>{ people[index].email }</div>
       </div>
     </div>
    );
  }
}

export default connect(state => ({
  people: peopleListSelector(state),
  loading: state[moduleName].loading
}), { fetchPeople })(VirtualizedPeopleList);