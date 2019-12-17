import { addPersonSaga, ADD_PERSON_REQUEST, ADD_PERSON } from "./people";
import { call, put } from 'redux-saga/effects';
import { generateId } from "./utils";

it ('should dispatch person with generated id', () => {
  const person = {
    firstName: 'Tester',
    lastName: 'Testerov',
    email: 'test@test.test'
  }

  const saga = addPersonSaga({
    type: ADD_PERSON_REQUEST,
    payload: person
  });

  expect(saga.next().value).toEqual(call(generateId));

  const id = generateId();

  expect(saga.next(id).value).toEqual(put({
    type: ADD_PERSON,
    payload: {
      person: { id, ...person }
    }
  }));
});