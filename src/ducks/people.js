import { appName } from  '../config';
import { OrderedMap, Record} from 'immutable';
import {entitiesToFbData, fbDataToEntities} from "./utils";
import { put, call, takeEvery, take, all, select,
  delay, cancel, cancelled, fork, spawn, race } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { reset } from 'redux-form';
import { createSelector } from 'reselect';
import firebase from "firebase";
import {fetchAllSaga} from "./events";

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
  email: null,
  events: []
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_PEOPLE_REQUEST = `${prefix}/FETCH_PEOPLE_REQUEST`;
export const FETCH_PEOPLE_SUCCESS = `${prefix}/FETCH_PEOPLE_SUCCESS`;
export const FETCH_PEOPLE_ERROR = `${prefix}/FETCH_PEOPLE_ERROR`;
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;
export const REMOVE_EVENT_FROM_PEOPLE_REQUEST = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_REQUEST`;
export const REMOVE_EVENT_FROM_PEOPLE_SUCCESS = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_SUCCESS`;
export const REMOVE_EVENT_FROM_PEOPLE_ERROR = `${prefix}/REMOVE_EVENT_FROM_PEOPLE_ERROR`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON_REQUEST:
    case FETCH_PEOPLE_REQUEST:
    case ADD_EVENT_REQUEST:
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

    case ADD_EVENT_SUCCESS:
      return state.setIn(['entities', payload.personUid, 'events'], payload.events);

    case REMOVE_EVENT_FROM_PEOPLE_SUCCESS:
      return state.mergeIn(['entities'], payload.people);

    case ADD_PERSON_ERROR:
    case FETCH_PEOPLE_ERROR:
    case REMOVE_EVENT_FROM_PEOPLE_ERROR:
      return state.set('loading', false)
        .set('error', payload.error);

    default:
      return state;
  }
}

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const idSelector = (_, props) => props.uid;
export const peopleListSelector = createSelector(entitiesSelector, entities => (
  entities.valueSeq().toArray()
));
export const personSelector = createSelector(entitiesSelector, idSelector, (entities, id) => entities.get(id));

export const peopleWithEventSelector = (id) => createSelector(entitiesSelector, (entities) => {
  return entities.filter((value) => value.get('events').includes(id))

});

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

export function addEventToPerson(eventUid, personUid) {
  return {
    type: ADD_EVENT_REQUEST,
    payload: { eventUid, personUid }
  };
}

export function removeEventFromPeople(uid) {
  return {
    type: REMOVE_EVENT_FROM_PEOPLE_REQUEST,
    payload: { uid }
  };
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

export const fetchPeopleSaga = function * (action) {
  try {
    const ref = firebase.database().ref('people');
    const data = yield call([ref, ref.once], 'value');
    const peopleList = yield call([data, data.val]);
    yield put({type: FETCH_PEOPLE_SUCCESS, payload: peopleList});
  } catch (error) {
    yield put({ type: FETCH_PEOPLE_ERROR, error });
  }

};

export const addEventSaga = function * (action) {
  const { eventUid, personUid } = action.payload;

  const eventRef = firebase.database().ref(`people/${personUid}/events`);
  const state = yield select(stateSelector);
  const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);
  try {
    yield call([eventRef, eventRef.set], events);
    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: {
        personUid,
        events
      }
    });
  } catch (_) {

  }
};

export const removeEventFromPeopleSaga = function * (action) {
  const { uid } = action.payload;

  const peopleWithEvent = yield select(peopleWithEventSelector(uid));
  const updatedPeople = peopleWithEvent.map(person => person.update('events', events => events.filter(value => value !== uid)));

  try {
    for (let [key, person] of updatedPeople) {
      const peopleRef = firebase.database().ref(`/people/${key}`);
      const res = yield call(entitiesToFbData, person);
      yield call([peopleRef, peopleRef.update], res);
    }

    yield put({
      type: REMOVE_EVENT_FROM_PEOPLE_SUCCESS,
      payload: {
        people: updatedPeople
      }
    });

  } catch (error) {
    yield put({
      type: REMOVE_EVENT_FROM_PEOPLE_ERROR,
      error
    });
  }
};

export const backgroundSyncSaga = function * () {
  try {
    while (true) {
      yield call(fetchPeopleSaga);
      yield delay(2000);
    }
  } catch (e) {
    console.log('error -->', e)
  } finally {
    if (yield cancelled()) {
      console.log('--> cancelled sync saga')
    }
  }
};

export const cancellableSync = function * () {
  yield race({
    sync: realtimeSync(),
    delay: delay(5000)
  });

  /*const task = yield fork(realtimeSync);
  yield delay(6000);
  yield cancel(task);*/
};

const createPeopleSocket = () => eventChannel(emmit => {
  const ref = firebase.database().ref('people');
  const callback = (data) => emmit({ data });
  ref.on('value', callback);

  return () => ref.off('value', callback);
});

export const realtimeSync = function * () {
  const chan = yield call(createPeopleSocket);
  try {
    while (true) {
      const { data } = yield take(chan);
      yield put({
        type:FETCH_PEOPLE_SUCCESS,
        payload: data.val()
      });
    }
  } finally {
    yield call([chan, chan.close])
    console.log('cancelled realtime saga')
  }
};


export const saga = function * () {
  yield spawn(cancellableSync);
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_PEOPLE_REQUEST, fetchPeopleSaga),
    takeEvery(ADD_EVENT_REQUEST, addEventSaga),
    takeEvery(REMOVE_EVENT_FROM_PEOPLE_REQUEST, removeEventFromPeopleSaga)
  ]);
};