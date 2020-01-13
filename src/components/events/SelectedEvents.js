import React, { Component } from "react";
import { selectedEventsSelector } from '../../ducks/events';
import { connect } from "react-redux";
import SelectedEventCard from "./SelectedEventCard";


class SelectedEvents extends Component {
 render() {
   const { events } = this.props;
   return (
     <div>
       {events.map(event => event && <SelectedEventCard event={event} key={event.uid}/>)}
     </div>
   );
 }
}

export default connect(state => ({
  events: selectedEventsSelector(state)
}))(SelectedEvents);