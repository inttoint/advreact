import React from "react";
import { shallow, mount } from 'enzyme';
import events from "../../mocks/conferences";
import { TableEventList } from "./TableEventList";
import Loader from "../common/Loader";
import { EventRecord } from '../../ducks/events';

const testEvents = events.map(event => new EventRecord({...event, uid: Math.random().toString()}));

describe('TableEventList container', () => {
  const props = {
    events: [],
    loading: false,
    loaded: false,

    fetchAll: () => {}
  };


  describe('TableEventList container initial', () => {
    const mockFetchAll = jest.fn();
    const nextProps = { ...props, fetchAll: mockFetchAll };
    mount(<TableEventList {...nextProps} />);

    it ('should request fetch data', () => {
      expect(mockFetchAll).toHaveBeenCalled();
    });
  });

  describe('TableEventList container loading', () => {
    it('should render loading', () => {
      const nextProps = { ...props, loading: true };
      const container = shallow(<TableEventList {...nextProps} />);

      expect(container.contains(<Loader />)).toBeTruthy();
    });
  });

  describe('TableEventList render events', () => {

    it('should render event list', () => {
      const nextProps = { ...props, events: testEvents };
      const container = shallow(<TableEventList {...nextProps} />);

      const rows = container.find('.test--event-list__row');
      expect(rows.length).toEqual(testEvents.length);
    });

    it('should select event', () => {
      let selected = null;
      const selectEvent = (uid) => selected = uid;
      const nextProps = {
        ...props,
        events: testEvents,
        selectEvent
      };

      const container = mount(<TableEventList { ...nextProps } />);
      container.find('.test--event-list__row').first().simulate('click');

      expect(selected).toEqual(testEvents[0].uid);
    });
  });

});
