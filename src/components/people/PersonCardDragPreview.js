import React from "react";
import { connect } from 'react-redux';
import { personSelector } from '../../ducks/people';

const PersonCardDragPreview = (props) => {
  return (
    <div style={{fontWeight: 'bold', fontSize: '20px'}}>
      {props.person.email}
    </div>
  );
};

export default connect((state, props) => ({
  person: personSelector(state,props)
}))(PersonCardDragPreview);