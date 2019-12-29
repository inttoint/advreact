import React, { Component } from "react";
import { DragLayer } from "react-dnd";

const layerStyle = {
  position:'fixed',
  pointerEvents: 'none',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 10000
};

class CustomDragLayer extends Component {

  getItem() {
    const { x, y } = this.props.offset;
    const style = {
      transform: `translate(${x}px,${y}px)`
    };

    return <div style={style}>Hi!</div>
  }

  render() {
    const { isDragging } = this.props;
    console.log('-->', isDragging);
    if (!isDragging) return null;

    return (
      <div style={layerStyle}>
        {this.getItem()}
      </div>
    );
  }
}

const collect = (monitor) => ({
  isDragging: monitor.isDragging(),
  offset: monitor.getSourceClientOffset()
});

export default DragLayer(collect)(CustomDragLayer);