import React from "react";
import { DropTarget } from 'react-dnd';
import { removeEvent } from "../../ducks/events";
import { connect } from "react-redux";

const Trash = (props) => {
  const { connectDropTarget, highlighted, hovered } = props;

  const style = {
    display: 'inline-block',
    float: 'right',
    padding: '0 30px',
    border: `2px solid ${highlighted ? 'darkgreen' : 'red'}`,
    borderRadius: '0 0 50% 50%',
    color: highlighted ? 'darkgreen' : 'red',
    backgroundColor: hovered ? 'silver' : 'white'
  };

  return connectDropTarget(
    <div style={style} >
      <h3>TRASH</h3>
    </div>
  );
};

const spec = {
  drop(props, monitor) {
    const eventUid = monitor.getItem().uid;
    props.removeEvent(eventUid);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  highlighted: monitor.canDrop(),
  hovered: monitor.isOver()
});

export default connect(null, { removeEvent })(DropTarget(['event'], spec, collect)(Trash));