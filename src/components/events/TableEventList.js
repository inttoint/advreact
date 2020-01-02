import React, { Component } from "react";
import { connect } from "react-redux";
import { eventListSelector, moduleName, fetchAll, selectEvent } from "../../ducks/events";
import Loader from '../common/Loader'

export class TableEventList extends Component {

  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    const { loading } = this.props;

    if (loading) return <Loader />;

    return (
      <div>
        <table>
          <tbody>
          { this.getRows() }
          </tbody>
        </table>
      </div>
    );
  }

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
}), { fetchAll, selectEvent })(TableEventList);