import { appName } from  '../config';
import { List, Record} from 'immutable';

const ReducerState = Record({
  entities: List()
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON:
      const person = new PersonRecord(payload.person);
      return state.update('entities', entities => entities.push(person));

    default:
      return state;
  }
}

export function addPerson(person) {
  return (dispatch) => {
    dispatch({
      type: ADD_PERSON,
      payload: {
        person: {
          id: Date.now(),
          ...person
        }
      }
    });
  };
}