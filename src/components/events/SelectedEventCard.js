import React from "react";
import { DropTarget } from 'react-dnd';
import {useDragSourceMonitor} from "react-dnd/lib/hooks/internal/drag";

const SelectedEventCard = (props) => {
  const { connectDropTarget } = props;
  const { title, when, where } = props.event;

  return connectDropTarget(
    <div>
      <h3>{title}</h3>
      <p>{where}, {when}</p>
    </div>
  );
};

const spec = {
  drop(props, monitor) {
    const personUid = monitor.getItem().uid;
    const eventUid = props.event.uid;

    console.log(`--> person: ${personUid} event:${eventUid}`);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

export default DropTarget(['person'], spec, collect)(SelectedEventCard);