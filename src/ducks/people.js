import { appName } from  '../config';
import { List, Record} from 'immutable';
import { generateId } from "./utils";
import { put, call, takeEvery } from 'redux-saga/effects';
import { reset } from 'redux-form';
import firebase from "firebase";

const ReducerState = Record({
  entities: List(),
  loading: false,
  loaded: false
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      const person = new PersonRecord(payload.person);
      return state
        .set('loading', false)
        .update('entities', entities => entities.push(person));

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

  const ref = firebase.database().ref('people');
  yield call([ref, ref.push], action.payload);

  yield put({
    type: ADD_PERSON_SUCCESS,
    payload: {
      person: { id, ...action.payload }
    }
  });
  yield put(reset('newPerson')); /* ToDo: Вынести название формы */
};

export const saga = function * () {
  yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga);
};