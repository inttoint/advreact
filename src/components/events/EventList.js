import React, { Component } from "react";
import { connect } from "react-redux";
import { moduleName } from "../../ducks/events";

class EventList extends Component {
 render() {
   return (
     <div />
   );
 }
}

export default connect(state => ({
  events: state[moduleName]
}))(EventList);