import React from "react";
import { DropTarget } from 'react-dnd';

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

};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

export default DropTarget(['person'], spec, collect)(SelectedEventCard);