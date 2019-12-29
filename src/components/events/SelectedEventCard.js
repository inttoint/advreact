import React from "react";
import { DropTarget } from 'react-dnd';
import {connect} from "react-redux";
import {addEventToPerson, peopleListSelector} from "../../ducks/people";

const SelectedEventCard = (props) => {
  const { connectDropTarget, canDrop, hovered, people } = props;
  const { title, when, where } = props.event;

  const peopleElement = people && (
    <div style={{color: 'blue'}}>
      <p>{people.map(person => person.email).join(', ')}</p>
    </div>
  );

  const dropStyle = {
    border: `2px solid ${canDrop ? 'green' : 'white'}`,
    backgroundColor: hovered ? 'gray' : 'white'
  };
  return connectDropTarget(
    <div style={dropStyle}>
      <h3>{title}</h3>
      <p>{where}, {when}</p>
      {peopleElement}
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

export default connect((state, props) => ({
  people: peopleListSelector(state).filter(person => person.events.includes(props.event.uid))
}), { addEventToPerson })(DropTarget(['person'], spec, collect)(SelectedEventCard));