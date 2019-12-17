import { all } from 'redux-saga/effects';
import { saga as peopleSaga } from '../ducks/people';

export default function * rootSaga() {
  yield all([
    peopleSaga()
  ]);
}