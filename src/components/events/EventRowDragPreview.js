import React from 'react';
import { connect } from 'react-redux';
import { eventSelector } from '../../ducks/events';

const EventRowDragPreview = (props) => {
  return (
    <div style={{fontWeight: 'bold', fontSize: '20px'}}>
      { props.event.title }
    </div>
  );
};

export default connect((state, props) => ({
  event: eventSelector(state, props)
}))(EventRowDragPreview);