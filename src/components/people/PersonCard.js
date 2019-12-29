import React from "react";
import { DragSource } from 'react-dnd';

const PeopleCard = (props) => {
  const {
    person: { firstName, lastName, email },
    style, connectDragSource, isDragging } = props;
  const draggStyle = {
    backgroundColor: isDragging ? 'gray' : 'white'
  };
  return (
    <div style={{width: 200, height: 100, ...draggStyle, ...style}}>
      {connectDragSource(<h3>{firstName}&nbsp;{lastName}</h3>)}
      <p>{email}</p>
    </div>
  );
};

const spec = {
  beginDrag(props) {
    return {
      uid: props.person.uid
    }
  },
  endDrag(props, monitor) {
    const personUid = props.person.uid;
    const dropRes = monitor.getDropResult();
    const eventUid = dropRes && dropRes.eventUid;

    console.log(`endDrag --> ${personUid} ${eventUid}`)
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource('person', spec, collect)(PeopleCard);