import React, { Component } from "react";
import { selectedEventsSelector } from '../../ducks/events';
import { connect } from "react-redux";
import SelectedEventCard from "./SelectedEventCard";
import { TransitionMotion } from 'react-motion';


class SelectedEvents extends Component {
 render() {
   return (
     <TransitionMotion
       styles={this.getStyles()}
     >
       { interpolatedStyles => (
         <div>
           {
             interpolatedStyles.map(config => (
               <div style={config.style} key={config.key}>
                 <SelectedEventCard event={config.data} />
               </div>
             ))
           }
         </div>
       )
       }
     </TransitionMotion>
   );
 }

 getStyles() {
   return this.props.events.map(event => ({
     style: {
       opacity: 1
     },
     key: event.uid,
     data: event
   }));
 }
}

export default connect(state => ({
  events: selectedEventsSelector(state)
}))(SelectedEvents);