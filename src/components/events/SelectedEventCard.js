import React from "react";
import { DropTarget } from 'react-dnd';
import {connect} from "react-redux";
import {addEventToPerson} from "../../ducks/people";

const SelectedEventCard = (props) => {
  const { connectDropTarget, canDrop, hovered } = props;
  const { title, when, where } = props.event;

  const dropStyle = {
    border: `2px solid ${canDrop ? 'green' : 'white'}`,
    backgroundColor: hovered ? 'gray' : 'white'
  };
  return connectDropTarget(
    <div style={dropStyle}>
      <h3>{title}</h3>
      <p>{where}, {when}</p>
    </div>
  );
};

const spec = {
  drop(props, monitor) {
    const personUid = monitor.getItem().uid;
    const eventUid = props.event.uid;

    props.addEventToPerson(eventUid, personUid);

    return { eventUid };
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  hovered: monitor.isOver()
});

export default connect(null, { addEventToPerson })(DropTarget(['person'], spec, collect)(SelectedEventCard));