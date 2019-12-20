import { appName } from "../config";
import { OrderedMap, Record } from "immutable";
import { all, take, call, put } from 'redux-saga/effects';
import firebase from "firebase";


export const moduleName = 'events';
const prefix = `${appName}/${moduleName}`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;


export const ReducerRecord = new Record({
  entities: new OrderedMap(),
  loading: false,
  loaded: false
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);

    default:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', new OrderedMap(payload));
  }
}

export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

export const fetchAllSaga = function * () {
  yield take(FETCH_ALL_REQUEST);
  const ref = firebase.database().ref('/events');
  const data = yield call([ref, ref.once], 'value');
  yield put({ type: FETCH_ALL_SUCCESS, payload: data.val() });

};

export const saga = function * () {
  yield all([
    fetchAllSaga()
  ]);
};