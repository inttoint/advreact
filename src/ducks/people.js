import { appName } from  '../config';
import { List, Record} from 'immutable';
import {fbDataToEntities, generateId} from "./utils";
import { put, call, takeEvery, take, all } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { createSelector } from 'reselect';
import firebase from "firebase";

const ReducerState = Record({
  entities: List(),
  loading: false,
  loaded: false
});

const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const FETCH_PEOPLE_REQUEST = `${prefix}/FETCH_PEOPLE_REQUEST`;
export const FETCH_PEOPLE_SUCCESS = `${prefix}/FETCH_PEOPLE_SUCCESS`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON_REQUEST:
    case FETCH_PEOPLE_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      const person = new PersonRecord(payload.person);
      return state
        .set('loading', false);

    case FETCH_PEOPLE_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDataToEntities(payload, PersonRecord));

    default:
      return state;
  }
}

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray()
));

export function addPerson(person) {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person
  }
}

export function fetchPeople() {
  return {
    type: FETCH_PEOPLE_REQUEST
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

export const fetchPersonSaga = function * () {
  while (true) {
    yield take(FETCH_PEOPLE_REQUEST);

    const ref = firebase.database().ref('people');
    const data = yield call([ref, ref.once], 'value');

    yield put({ type: FETCH_PEOPLE_SUCCESS, payload: data.val() });
  }
};

export const saga = function * () {
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    fetchPersonSaga()
  ]);
};