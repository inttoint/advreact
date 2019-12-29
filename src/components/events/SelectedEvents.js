import React from "react";
import { selectedEventsSelector } from '../../ducks/events';
import { connect } from "react-redux";
import SelectedEventCard from "./SelectedEventCard";


const SelectedEvents = (props) => {
  const { events } = props;
  return (
    <div>
      {events.map(event => <SelectedEventCard event={event} key={event.uid}/>)}
    </div>
  );
};

export default connect(state => ({
  events: selectedEventsSelector(state)
}))(SelectedEvents);