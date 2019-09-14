import { all } from 'redux-saga/effects';
import logger from 'redux-logger';

import explorer from './explorer';
import auth from './auth';
import encode from './encode';
import video from './video';
import music from './music';

export default function* rootSaga() {
  yield all([
    ...explorer,
    ...auth,
    ...encode,
    ...video,
    ...music,
    process.env.NODE_ENV === 'development' && logger,
  ])
}