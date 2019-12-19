import firebase from 'firebase';
import { appName } from '../config';
import { Record } from 'immutable';
import { all, call, take, put, cps, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

const firebaseAuth = firebase.auth();

export const ReducerRecord = Record({
  user: null,
  error: null,
  loading: false
});

export const moduleName = 'auth';
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;
export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`;
export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`;


export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_IN_REQUEST:
    case SIGN_OUT_REQUEST:
    case SIGN_UP_REQUEST:
      return state.set('loading', true);

    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();

    case SIGN_IN_ERROR:
    case SIGN_UP_ERROR:
      return state
        .set('loading', false)
        .set('error', error);

    default:
      return state;
  }
};

export function signIn(email, password) {
  return {
    type: SIGN_IN_REQUEST,
    payload: { email, password }
  };
}

export function signUp(email, password) {
  return {
    type: SIGN_UP_REQUEST,
    payload: { email, password }
  };
}

export function signOut() {
  return {
    type: SIGN_OUT_REQUEST
  };
}

export function * signInSaga () {

  while (true) {
    const {payload: {email, password}} = yield take(SIGN_IN_REQUEST);
    try {
      const user = yield call([firebaseAuth, firebaseAuth.signInWithEmailAndPassword], email, password);
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: user
      });

      yield put(push('/admin'))

    } catch (error) {
      yield put({
        type: SIGN_IN_ERROR,
        error
      });
    }
  }
}

export function * signUpSaga() {
  while (true) {
    const {payload: {email, password}} = yield take(SIGN_UP_REQUEST);

    try {
      const user = yield call([firebaseAuth, firebaseAuth.createUserWithEmailAndPassword], email, password);
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: user
      });
      yield put(push('/admin'))
    } catch (error) {
      yield put({
        type: SIGN_UP_ERROR,
        error
      });
    }
  }
}

export const watchStatusChange = function * () {

  try {
    yield cps([firebaseAuth, firebaseAuth.onAuthStateChanged]);
  } catch (user) {
    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });
  }
};

export const signOutSaga = function * () {
  try {
    yield call([firebaseAuth, firebaseAuth.signOut]);
    yield put({
      type: SIGN_OUT_SUCCESS
    });
    yield put(push('/auth/signin'))
  } catch (_) {

  }
};

export const saga = function * () {
  yield all([
    signUpSaga(),
    watchStatusChange(),
    signInSaga(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga)
  ]);
};

