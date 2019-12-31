import React, { Component } from "react";
import { defaultTableRowRenderer } from 'react-virtualized';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

class TableRow extends Component{

  componentDidMount() {
    this.props.connectPreview(getEmptyImage());
  }

  render() {
   const { connectDragSource, isDragging, ...rest } = this.props;
   const dragStyle = { color: isDragging? 'silver' : 'black' };

   return (
     <div style={dragStyle}>
       {connectDragSource(defaultTableRowRenderer(rest))}
     </div>
   );
 }
}

const spec = {
  beginDrag(props) {
    return {
      uid: props.rowData.uid
    };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

export default DragSource('event', spec, collect)(TableRow);