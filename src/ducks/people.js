import { appName } from  '../config';
import { List, Record} from 'immutable';
import { generateId } from "./utils";
import { put, call, takeEvery } from 'redux-saga/effects';

const ReducerState = Record({
  entities: List()
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON:
      const person = new PersonRecord(payload.person);
      return state.update('entities', entities => entities.push(person));

    default:
      return state;
  }
}

export function addPerson(person) {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person
  }
}

export const addPersonSaga = function * (action) {
  const id = yield call(generateId);
  yield put({
    type: ADD_PERSON,
    payload: {
      person: { id, ...action.payload }
    }
  });
};

export const saga = function * () {
  yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga);
};