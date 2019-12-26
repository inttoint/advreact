import reducer, {
  addPersonSaga,
  fetchPeopleSaga,
  ADD_PERSON_REQUEST,
  ADD_PERSON_SUCCESS,
  FETCH_PEOPLE_REQUEST, FETCH_PEOPLE_SUCCESS, ReducerState, PersonRecord, ADD_PERSON_ERROR, FETCH_PEOPLE_ERROR,
} from "./people";
import {call, put, take} from 'redux-saga/effects';
import {reset} from "redux-form";
import firebase from "firebase";
import {fbDataToEntities, generateId} from "./utils";

const person = {
  firstName: 'Tester',
  lastName: 'Testerov',
  email: 'test@test.test'
};

describe('people saga', () => {
  const peopleRef = firebase.database().ref('people');

  it('should add person to firebase and entities', () => {
    const requestAction = { type: ADD_PERSON_REQUEST, payload: person };
    const saga = addPersonSaga(requestAction);

    expect(saga.next().value).toEqual(call([peopleRef, peopleRef.push], requestAction.payload));

    const key = generateId();

    expect(saga.next({ key }).value).toEqual(put({ type: ADD_PERSON_SUCCESS, payload: {...person, uid: key} }));
    expect(saga.next().value).toEqual(put(reset('newPerson')));
    expect(saga.next().done).toBeTruthy();
  });

  it('should fetch people from firebase', () => {
    const data = { val: () => {} };
    const peopleList = {};
    const saga = fetchPeopleSaga();

    expect(saga.next().value).toEqual(take(FETCH_PEOPLE_REQUEST));
    expect(saga.next().value).toEqual(call([peopleRef, peopleRef.once], 'value'));

    expect(saga.next(data).value).toEqual(call([data, data.val]));
    expect(saga.next(peopleList).value).toEqual(put({
      type: FETCH_PEOPLE_SUCCESS,
      payload: peopleList
    }))
  });

  describe('Errors', () => {
    const error = new Error('Wow! Something went wrong!');

    it('should catch error in addPersonSaga', () => {
      const requestAction = { type: ADD_PERSON_REQUEST, payload: person };
      const saga = addPersonSaga(requestAction);

      saga.next();
      expect(saga.throw(error).value).toEqual(put({
        type: ADD_PERSON_ERROR,
        error
      }));
    });

    it('should catch error in fetchPeopleSaga', () => {
      const saga = fetchPeopleSaga();

      saga.next();
      expect(saga.throw(error).value).toEqual(put({
        type: FETCH_PEOPLE_ERROR,
        error
      }));
    });
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
    const uid = generateId();
    const action = { type: ADD_PERSON_SUCCESS, payload: {...person, uid }};
    const expectedState = new ReducerState({ loading: false})
      .setIn(['entities', uid], new PersonRecord(action.payload));
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

  it('should handle the ADD_PERSON_ERROR action', () => {
    const error = new Error('Oops! Something went wrong!');
    const action = { type: ADD_PERSON_ERROR, payload: { error } };

    const expectedState = new ReducerState({
      loading: false,
      error
    });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle the FETCH_PEOPLE_ERROR action', () => {
    const error = new Error('Oops! Something went wrong!');
    const action = { type: FETCH_PEOPLE_ERROR, payload: { error } };

    const expectedState = new ReducerState({
      loading: false,
      error
    });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
