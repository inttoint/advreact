import React from "react";
import { shallow } from 'enzyme';
import events from "../../mocks/conferences";
import { EventList } from "./EventList";
import Loader from "../common/Loader";

const testEvents = events.map(event => ({...event, uid: Math.random().toString()}));

it('should render loading', () => {
  const container = shallow(<EventList loading fetchAll={() => {}} />);

  expect(container.contains(<Loader />));
});
