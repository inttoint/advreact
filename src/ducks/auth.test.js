import {
  ReducerRecord,
  SIGN_IN_ERROR,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
} from "./auth";
import reducer from '../ducks/auth';



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