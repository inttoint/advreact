import { appName } from "../config";
import { Record } from "immutable";
import { all } from 'redux-saga/effects';



export const moduleName = 'events';
const prefix = `${appName}/${moduleName}/`;


export const ReducerRecord = new Record({

});

export default function reducer(state = new ReducerRecord(), action) {
  const { type } = action;

  switch (type) {

    default:
      return state;
  }
}

export const saga = function * () {
  yield all([

  ]);
};