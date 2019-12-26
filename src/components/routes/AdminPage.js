import React from "react";
import PeopleList from "../people/PeopleList";
import EventList from "../events/VirtualizedEventList";
import SelectedEvents from "../events/SelectedEvents";

const AdminPage = () => {
  return (
    <div>
      <h2>Admin Page</h2>
      <PeopleList />
      <hr/>
      <SelectedEvents />
      <hr/>
      <EventList />
    </div>
  );
};

export default AdminPage;