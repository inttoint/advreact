import React from "react";

const PeopleCard = (props) => {
  const { person: { firstName, lastName, email }, style } = props;
  return (
    <div style={{width: 200, height: 100, ...style}}>
      <h3>{firstName}&nbsp;{lastName}</h3>
      <p>{email}</p>
    </div>
  );
};

export default PeopleCard;