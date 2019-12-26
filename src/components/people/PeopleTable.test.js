import React from "react";
import { shallow, mount } from 'enzyme';
import people from '../../mocks/people';
import {PersonRecord} from "../../ducks/people";
import {PeopleTable} from "./PeopleTable";
import Loader from "../common/Loader";

const testPeople = people.map(PersonRecord);

describe('PeopleTable container', () => {
  const props = {
    people: [],
    loading: false,

    fetchPeople: () => {}
  };

  describe('PeopleTable container initial', () => {
    const mockFetchPeople = jest.fn();
    const nextProps = { ...props, fetchPeople: mockFetchPeople }

    shallow(<PeopleTable { ...nextProps } />);

    it('should request fetch data', () => {
      expect(mockFetchPeople).toHaveBeenCalled();
    })
  });

  describe('PeopleTable container loading', () => {
    it('should render loading component', () => {
      const nextProps = { ...props, loading: true };
      const container = shallow(<PeopleTable {...nextProps} />);

      expect(container.contains(<Loader />)).toBeTruthy();
    });
  });

  describe('PeopleTable render people', () => {

    it('should render people from short list', () => {
      const shortList = testPeople.slice(0, 5);
      const nextProps = { ...props, people: shortList };
      const container = mount(<PeopleTable { ...nextProps } />);
      const rows = container.find('.test--people-list__row');

      expect(rows.length - 1).toEqual(shortList.length);
    });

    it('should render people from long list', () => {
      const nextProps = { ...props, people: testPeople };
      const container = mount(<PeopleTable { ...nextProps } />);
      const rows = container.find('.test--people-list__row');

      expect(rows.length - 1).toEqual(15);
    });
  });
});