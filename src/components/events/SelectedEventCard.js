import React from "react";

const SelectedEventCard = (props) => {
  const { title, when, where } = props.event;
  return (
    <div>
      <h3>{title}</h3>
      <p>{where}, {when}</p>
    </div>
  );
};

export default SelectedEventCard;