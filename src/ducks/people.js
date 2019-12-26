import { appName } from  '../config';
import { OrderedMap, Record} from 'immutable';
import {fbDataToEntities} from "./utils";
import { put, call, takeEvery, take, all } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { createSelector } from 'reselect';
import firebase from "firebase";

export const ReducerState = Record({
  entities: new OrderedMap({}),
  loading: false,
  loaded: false,
  error: null
});

export const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_PEOPLE_REQUEST = `${prefix}/FETCH_PEOPLE_REQUEST`;
export const FETCH_PEOPLE_SUCCESS = `${prefix}/FETCH_PEOPLE_SUCCESS`;
export const FETCH_PEOPLE_ERROR = `${prefix}/FETCH_PEOPLE_ERROR`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON_REQUEST:
    case FETCH_PEOPLE_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['entities', payload.uid], new PersonRecord(payload));

    case FETCH_PEOPLE_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDataToEntities(payload, PersonRecord));

    case ADD_PERSON_ERROR:
    case FETCH_PEOPLE_ERROR:
      return state.set('loading', false)
        .set('error', payload.error);

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
  try {
    const {payload} = action;
    const peopleRef = firebase.database().ref('people');
    const ref = yield call([peopleRef, peopleRef.push], payload);
    yield put({
      type: ADD_PERSON_SUCCESS,
      payload: {...payload, uid: ref.key}
    });
    yield put(reset('newPerson')); /* ToDo: Вынести название формы */
  } catch (error) {
    yield put({ type: ADD_PERSON_ERROR, error });
  }
};

export const fetchPeopleSaga = function * () {
  while (true) {
    try {
      yield take(FETCH_PEOPLE_REQUEST);

      const ref = firebase.database().ref('people');
      const data = yield call([ref, ref.once], 'value');
      const peopleList = yield call([data, data.val]);
      yield put({type: FETCH_PEOPLE_SUCCESS, payload: peopleList});
    } catch (error) {
      yield put({ type: FETCH_PEOPLE_ERROR, error });
    }
  }
};

export const saga = function * () {
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    fetchPeopleSaga()
  ]);
};