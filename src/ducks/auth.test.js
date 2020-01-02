import {
  ReducerRecord,
  SIGN_IN_ERROR, SIGN_IN_REQUEST, SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  SIGN_UP_ERROR, SIGN_UP_REQUEST, SIGN_UP_SUCCESS,
  signInSaga, signOutSaga, signUpSaga } from "./auth";
import reducer from '../ducks/auth';
import { call, take, put } from 'redux-saga/effects';
import firebase from 'firebase';
import { push } from 'connected-react-router';


describe('auth saga', () => {
  const auth = firebase.auth();
  const authData  = {
    email: 'email@email.email',
    password: 'emailemail'
  };
  const user = {
    uid: Math.random().toString(),
    email: authData
  };

  it ('should user sign in with email and password', () => {

    const saga = signInSaga();
    const requestAction = { type: SIGN_IN_REQUEST, payload: authData };

    expect(saga.next().value).toEqual(take(SIGN_IN_REQUEST));
    expect(saga.next(requestAction).value).toEqual(call(
      [auth, auth.signInWithEmailAndPassword],
      authData.email, authData.password));

    expect(saga.next(user).value).toEqual(put({ type: SIGN_IN_SUCCESS, payload: user }));
    expect(saga.next().value).toEqual(put(push('/admin')));
  });

  it ('should catch an error during sign in ', () => {
    const saga = signInSaga();
    const error = new Error('Something went wrong');

    expect(saga.next().value).toEqual(take(SIGN_IN_REQUEST));
    expect(saga.throw(error).value).toEqual(put({ type: SIGN_IN_ERROR, error }));
  });

  it ('should user sign up with email and password', () => {
    const saga = signUpSaga();
    const requestAction = { type: SIGN_UP_REQUEST, payload: authData};

    expect(saga.next().value).toEqual(take(SIGN_UP_REQUEST));
    expect(saga.next(requestAction).value).toEqual(call(
      [auth, auth.createUserWithEmailAndPassword],
      authData.email, authData.password
    ));

    expect(saga.next(user).value).toEqual(put({ type: SIGN_UP_SUCCESS, payload: user }));
    expect(saga.next().value).toEqual(put(push('/admin')));
  });

  it ('should catch an error during sign up', () => {
    const saga = signUpSaga();
    const error = new Error('Something went wrong');

    expect(saga.next().value).toEqual(take(SIGN_UP_REQUEST));
    expect(saga.throw(error).value).toEqual(put({ type: SIGN_UP_ERROR, error }))
  });

  it ('should user sign out', () => {
    const saga = signOutSaga();

    expect(saga.next().value).toEqual(call([auth, auth.signOut]));
    expect(saga.next().value).toEqual(put({ type: SIGN_OUT_SUCCESS }));
    expect(saga.next().value).toEqual(put(push('/auth/signin')));
    expect(saga.next().done).toBeTruthy()
  });
});

describe('auth reducer', () => {
  const initialState = new ReducerRecord({
    user: null,
    error: null,
    loading: false
  });
  const user = {
    email: 'test@test.test',
    password: 'testtesttest'
  };

  it ('should return the initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  });

  it ('should handle the SIGN_IN_SUCCESS action', () => {

    const action = { type: SIGN_IN_SUCCESS, payload: {user} };
    const expectedState = new ReducerRecord()
      .set('user', user)
      .set('loading', false);

    expect(reducer(initialState, action)).toEqual(expectedState);

  });

  it ('should handle the SIGN_OUT_SUCCESS action', () => {
    const state = new ReducerRecord().set('user', {});
    const action = { type: SIGN_OUT_SUCCESS };
    const expectedState = new ReducerRecord();

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it ('should handle the SIGN_IN_ERROR action', () => {
    const error = new Error();
    const action = { type: SIGN_IN_ERROR, error }
    const expectedState = initialState
      .set('error', error)
      .set('loading', false);

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});