import React from "react";
import { shallow, mount } from 'enzyme';
import people from '../../mocks/people';
import {PersonRecord} from "../../ducks/people";
import {TablePeopleList} from "./TablePeopleList";
import Loader from "../common/Loader";

const testPeople = people.map(PersonRecord);

describe('TablePeopleList container', () => {
  const props = {
    people: [],
    loading: false,

    fetchPeople: () => {}
  };

  describe('TablePeopleList container initial', () => {
    const mockFetchPeople = jest.fn();
    const nextProps = { ...props, fetchPeople: mockFetchPeople }

    shallow(<TablePeopleList { ...nextProps } />);

    it('should request fetch data', () => {
      expect(mockFetchPeople).toHaveBeenCalled();
    })
  });

  describe('TablePeopleList container loading', () => {
    it('should render loading component', () => {
      const nextProps = { ...props, loading: true };
      const container = shallow(<TablePeopleList {...nextProps} />);

      expect(container.contains(<Loader />)).toBeTruthy();
    });
  });

  describe('TablePeopleList render people', () => {

    it('should render people from short list', () => {
      const shortList = testPeople.slice(0, 5);
      const nextProps = { ...props, people: shortList };
      const container = mount(<TablePeopleList { ...nextProps } />);
      const rows = container.find('.test--people-list__row');

      expect(rows.length - 1).toEqual(shortList.length);
    });

    it('should render people from long list', () => {
      const nextProps = { ...props, people: testPeople };
      const container = mount(<TablePeopleList { ...nextProps } />);
      const rows = container.find('.test--people-list__row');

      expect(rows.length - 1).toEqual(15);
    });
  });
});