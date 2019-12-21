import React, { Component } from "react";
import { connect } from "react-redux";
import { eventListSelector, moduleName, fetchAll, selectEvent } from "../../ducks/events";
import Loader from '../common/Loader';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css'

export class EventList extends Component {

  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    const { loading, events } = this.props;

    if (loading) return <Loader />;

    return (
      <Table
        rowCount={events.length}
        rowGetter={this.rowGetter}
        overscanRowCount={5}
        rowHeight={40}
        headerHeight={50}
        width={700}
        height={300}
      >
        <Column
          label="title"
          width={300}
          dataKey="title" />
        <Column
          label="where"
          width={250}
          dataKey="where" />
        <Column
          label="month"
          width={150}
          dataKey="month" />
      </Table>
    );
  }

  rowGetter = ({ index }) => {
    return this.props.events[index];
  };

  getRows() {
    return this.props.events.map(this.getRow);
  }

  getRow = (event) => {
    return (
      <tr
        key={event.uid}
        className='test--event-list__row'
        onClick={this.handleRowClick(event.uid)}>
        <td>{event.title}</td>
        <td>{event.where}</td>
        <td>{event.month}</td>
      </tr>
    )
  };

  handleRowClick = (uid) => () => {
    const { selectEvent } = this.props;
    selectEvent && selectEvent(uid)
  }
}


export default connect(state => ({
  events: eventListSelector(state),
  loading: state[moduleName].loading
}), { fetchAll, selectEvent })(EventList);