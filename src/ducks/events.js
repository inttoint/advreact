import { appName } from "../config";
import { OrderedMap, OrderedSet, Record } from "immutable";
import { all, take, call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from "firebase";
import { fbDataToEntities } from "./utils";
import { createSelector } from 'reselect';


export const moduleName = 'events';
const prefix = `${appName}/${moduleName}`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_LAZY_REQUEST = `${prefix}/FETCH_LAZY_REQUEST`;
export const FETCH_LAZY_START = `${prefix}/FETCH_LAZY_START`;
export const FETCH_LAZY_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`;
export const SELECT_EVENT = `${prefix}/SELECT_EVENT`;
export const REMOVE_EVENT_REQUEST = `${prefix}/REMOVE_EVENT_REQUEST`;
export const REMOVE_EVENT_SUCCESS = `${prefix}/REMOVE_EVENT_SUCCESS`;


export const ReducerRecord = new Record({
  entities: new OrderedMap({}),
  selected: new OrderedSet([]),
  loading: false,
  loaded: false
});

export const EventRecord = new Record({
  uid: null,
  title: null,
  url: null,
  where: null,
  when: null,
  month: null,
  submissionDeadline: null
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
    case FETCH_LAZY_START:
    case REMOVE_EVENT_REQUEST:
      return state.set('loading', true);

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDataToEntities(payload, EventRecord));

    case FETCH_LAZY_SUCCESS:
      return state
        .set('loading', false)
        .mergeIn(['entities'], fbDataToEntities(payload, EventRecord))
        .set('loaded', Object.keys(payload).length < 10);

    case SELECT_EVENT:
      return state.selected.contains(payload.uid)
        ? state.update('selected', selected => selected.remove(payload.uid))
        : state.update('selected', selected => selected.add(payload.uid));

    case REMOVE_EVENT_SUCCESS:
      return state.set('loading', false)
        .update('entities', event => event.remove(payload.uid));

    default:
      return state;
  }
}

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const idSelector = (_, props) => props.uid;
export const eventListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray()
));

export const selectionSelector = createSelector(stateSelector, state => state.selected);
export const selectedEventsSelector = createSelector(entitiesSelector, selectionSelector, (entities, selection) => (
  selection.toArray().map(uid => entities.get(uid))
));

export const eventSelector = createSelector(entitiesSelector, idSelector, (entities, id) => entities.get(id));


export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

export function selectEvent(uid) {
  return {
    type: SELECT_EVENT,
    payload: { uid }
  }
}

export function fetchLazy () {
  return {
    type: FETCH_LAZY_REQUEST
  };
}

export function removeEvent(uid) {
  return {
    type: REMOVE_EVENT_REQUEST,
    payload: { uid }
  };
}

export const fetchAllSaga = function * () {
  while (true) {
    yield take(FETCH_ALL_REQUEST);
    const ref = firebase.database().ref('/events');
    const data = yield call([ref, ref.once], 'value');
    yield put({type: FETCH_ALL_SUCCESS, payload: data.val()});
  }
};

export const fetchLazySaga = function * () {
  while (true) {
    yield take(FETCH_LAZY_REQUEST);
    const state = yield select(stateSelector);

    if (state.loading || state.loaded) continue;

    yield put({ type: FETCH_LAZY_START });

    const lastEvent = state.entities.last();
    const ref = firebase.database().ref('events')
      .orderByKey()
      .limitToFirst(10)
      .startAt(lastEvent ? lastEvent.uid : '');

    const data = yield call([ref, ref.once], 'value');

    yield put({ type: FETCH_LAZY_SUCCESS, payload: data.val() });

  }
};

export const removeEventSaga = function * (action) {
  const uid = action.payload.uid;
  const eventRef = firebase.database().ref(`events/${uid}`);

  yield call([eventRef, eventRef.remove]);
  yield put({ type: REMOVE_EVENT_SUCCESS, payload: { uid } });
};

export const saga = function * () {
  yield all([
    fetchAllSaga(),
    fetchLazySaga(),
    takeEvery(REMOVE_EVENT_REQUEST, removeEventSaga)
  ]);
};