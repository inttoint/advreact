import React from "react";
import { defaultTableRowRenderer } from 'react-virtualized';
import { DragSource } from 'react-dnd';

const TableRow = (props) => {
  const { connectDragSource, ...rest } = props;
  return connectDragSource(defaultTableRowRenderer(rest));
};

const spec = {
  beginDrag(props) {
    return {
      eventUid: props.rowData.uid
    };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource()
});

export default DragSource('event', spec, collect)(TableRow);