import React from "react";
import { defaultTableRowRenderer } from 'react-virtualized';

const TableRow = (props) => {
  const {...rest} = props;
  return defaultTableRowRenderer(rest)
};

export default TableRow;