import React from "react";
import { DropTarget } from 'react-dnd';

const Trash = (props) => {
  const { connectDropTarget } = props;

  const style = {
    display: 'inline-block',
    float: 'right',
    border: "2px solid red",
    color: 'red'
  };

  return connectDropTarget(
    <div style={style} >
      <h3>TRASH</h3>
    </div>
  );
};

const spec = {
  drop(props, monitor) {
    const eventUid = monitor.getItem().eventUid;

    console.log('-->', eventUid)
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

export default DropTarget(['event'], spec, collect)(Trash);