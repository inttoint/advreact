import reducer, {
  addPersonSaga,
  fetchPeopleSaga,
  ADD_PERSON_REQUEST,
  ADD_PERSON_SUCCESS,
  FETCH_PEOPLE_REQUEST, FETCH_PEOPLE_SUCCESS, ReducerState, PersonRecord,
} from "./people";
import {call, put, take} from 'redux-saga/effects';
import {reset} from "redux-form";
import firebase from "firebase";
import {fbDataToEntities} from "./utils";

describe('people saga', () => {
  it('should dispatch person with generated id', () => {
    const ref = firebase.database().ref('people');
    const person = {
      firstName: 'Tester',
      lastName: 'Testerov',
      email: 'test@test.test'
    };
    const requestAction = { type: ADD_PERSON_REQUEST, payload: person };
    const saga = addPersonSaga(requestAction);

    expect(saga.next().value).toEqual(call([ref, ref.push], requestAction.payload));
    expect(saga.next().value).toEqual(put({ type: ADD_PERSON_SUCCESS }));
    expect(saga.next().value).toEqual(put(reset('newPerson')));
    expect(saga.next().done).toBeTruthy();
  });

  it('should fetch people from firebase', () => {
    const ref = firebase.database().ref('people');
    const data = { val: () => {} };
    const peopleList = {};
    const saga = fetchPeopleSaga();

    expect(saga.next().value).toEqual(take(FETCH_PEOPLE_REQUEST));
    expect(saga.next().value).toEqual(call([ref, ref.once], 'value'));

    expect(saga.next(data).value).toEqual(call([data, data.val]));
    expect(saga.next(peopleList).value).toEqual(put({
      type: FETCH_PEOPLE_SUCCESS,
      payload: peopleList
    }))
  });
});

describe('people reducer', () => {

  const initialState = new ReducerState();

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the ADD_PERSON_REQUEST action', () => {
    const action = { type: ADD_PERSON_REQUEST };
    const expectedState = new ReducerState({ loading: true });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle the FETCH_PEOPLE_REQUEST action', () => {
    const action = { type: FETCH_PEOPLE_REQUEST };
    const expectedState = new ReducerState({ loading: true });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle the ADD_PERSON_SUCCESS action', () => {
    const action = { type: ADD_PERSON_SUCCESS };
    const expectedState = new ReducerState({ loading: false });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle the FETCH_PEOPLE_SUCCESS action', () => {
    const peopleList = { 0: {}, 1: {}};
    const action = { type: FETCH_PEOPLE_SUCCESS, payload: peopleList };
    const expectedState = new ReducerState({
      loading: false,
      loaded: true,
      entities: fbDataToEntities(peopleList, PersonRecord)
    });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
