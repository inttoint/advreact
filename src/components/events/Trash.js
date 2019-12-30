import React from "react";

const Trash = () => {

  const style = {
    display: 'inline-block',
    float: 'right',
    border: "2px solid red",
    color: 'red'
  };

  return (
    <div style={style} >
      <h3>TRASH</h3>
    </div>
  );
};

export default Trash;