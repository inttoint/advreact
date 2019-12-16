import { appName } from  '../config';
import { List, Record, Map} from 'immutable';

const ReducerRecord = Record({
  userList: List(),
  error: null,
  loading: null
});

export const moduleName = 'people';
export const ADD_PERSON_REQUEST = `${appName}/${moduleName}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${appName}/${moduleName}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${appName}/${moduleName}/ADD_PERSON_ERROR`;

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case ADD_PERSON_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      const user = new Map({...payload});
      return state
        .set('loading', false)
        .set('error', null)
        .update('userList', list => list.push(user));

    case ADD_PERSON_ERROR:
      return state
        .set('loading', false)
        .set('error', error);
    default:
      return state;
  }
}

export function addPerson(firstName, lastName, email) {
  return {
      type: ADD_PERSON_SUCCESS,
      payload: { firstName, lastName, email }

  };
}