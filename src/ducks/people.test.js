import {
  addPersonSaga,
  fetchPeopleSaga,
  ADD_PERSON_REQUEST,
  ADD_PERSON,
  ADD_PERSON_SUCCESS,
  FETCH_PEOPLE_REQUEST, FETCH_PEOPLE_SUCCESS
} from "./people";
import {call, put, take} from 'redux-saga/effects';
import {reset} from "redux-form";
import firebase from "firebase";

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
    const saga = fetchPeopleSaga();
    expect(saga.next().value).toEqual(take(FETCH_PEOPLE_REQUEST));

    expect(saga.next().value).toEqual(call([ref, ref.once], 'value'));

    // expect(saga.next().value).toEqual(put({
    //   type: FETCH_PEOPLE_SUCCESS
    // }))

  });
});

// describe('people reducer', () => {
//
//   it('should return the initial state');
//
//   it('should handle the ADD_PERSON_REQUEST action');
//
//   it('should handle the ADD_PERSON_SUCCESS action');
//
//   it('should handle the FETCH_PEOPLE_SUCCESS action');
// });
