import React from "react";
import { DropTarget } from 'react-dnd';
import { removeEvent } from "../../ducks/events";
import { removeEventFromPeople } from '../../ducks/people';
import { connect } from "react-redux";
import { Motion, spring, presets } from 'react-motion';

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

  return (
    <Motion
      defaultStyle={{opacity: 0}}
      style={{opacity: spring(1, {
          damping: presets.noWobble.damping * 3,
          stiffness: presets.noWobble.stiffness / 10
        })}}
    >
      { interpolatedStyles => connectDropTarget(
        <div style={{...style, ...interpolatedStyles}} >
          <h3>TRASH</h3>
        </div>
      )
      }
    </Motion>
  );
};

const spec = {
  drop(props, monitor) {
    const eventUid = monitor.getItem().uid;
    props.removeEventFromPeople(eventUid);
    props.removeEvent(eventUid);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  highlighted: monitor.canDrop(),
  hovered: monitor.isOver()
});

export default connect(null, { removeEvent, removeEventFromPeople })(DropTarget(['event'], spec, collect)(Trash));