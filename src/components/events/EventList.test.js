import React from "react";
import { shallow } from 'enzyme';
import events from "../../mocks/conferences";
import { EventList } from "./EventList";
import Loader from "../common/Loader";
import { EventRecord } from '../../ducks/events';

const testEvents = events.map(event => new EventRecord({...event, uid: Math.random().toString()}));

describe('EventList container', () => {
  const props = {
    events: [],
    loading: false,
    loaded: false,

    fetchAll: () => {}
  };


  describe('EventList container initial', () => {

  });

  describe('EventList container loading', () => {
    it('should render loading', () => {
      const nextProps = { ...props, loading: true };
      const container = shallow(<EventList {...nextProps} />);

      expect(container.contains(<Loader />));
    });
  });

  describe('EventList render events', () => {

    it('should render event list', () => {
      const nextProps = { ...props, events: testEvents };
      const container = shallow(<EventList {...nextProps} />);

      const rows = container.find('.test--event-list__row');
      expect(rows.length).toEqual(testEvents.length);
    });
  });

});
