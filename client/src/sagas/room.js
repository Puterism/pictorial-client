import { takeLatest, takeEvery, take, fork, call, put, apply, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, CONNECT_ROOM, CHECK_ROOM_CODE, IMAGE_READY, 
  SET_ROUND, SET_TIME_LIMIT, SET_GAME_READY, SET_GAME_START, SET_GAME_START_SUCCESS,
  fetchRoomCodeSuccess, fetchRoomCodeFailure,
  connectRoomSuccess, connectRoomFailure,
  checkRoomCodeSuccess, checkRoomCodeFailure,
  imageReadySuccess, imageReadyFailure, 
  setUserList, setRoomData, setGameStartSuccess,
  setGameReady,
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom, checkRoomCode, connectRoom, imageReady } from '../apis';
import socketConnection from '../libs/socketConnection';

function subscribe(socket, eventType) {
  return eventChannel(emit => {
    // const emitter = message => emit(message);

    // socket.on(eventType, emitter);
    // return function unsubscribe() {
    //   socket.off(eventType, emitter);
    // }

    socket.on('message', ({ text }) => {
      console.log(text);
    });

    // 현재 유저 정보 받아옴
    socket.on('userData', ({ userList }) => {
      console.log(userList);
      emit(setUserList(userList));
    });

    // 방 정보 변경
    socket.on('roomData', ({ roomData }) => {
      console.log(roomData);
      
      emit(setRoomData({ round: roomData.round, timeLimit: roomData.time }));
    });

    socket.on('gameStart', () => {
      emit(setGameStartSuccess());
    })

    socket.on('readyUserData', ({ userList }) => {
      console.log('ready: ', userList);

      emit(setUserList(userList));
    })

    return function unsubscribe() {
      socket.off('message');
      socket.off('userData');
      socket.off('roomData');
      socket.off('readyUserData');
    }
  });
}


function* read(socket, type) {
  const channel = yield call(subscribe, socket, type);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* setRoundSaga(socket) {
  while (true) {
    const { payload } = yield take(SET_ROUND);
    const code = yield select(state => state.room.code);
    const time = yield select(state => state.room.timeLimit);
  
    yield apply(socket, socket.emit, ['setRoom', code, payload, time]);
  }
}

function* setGameStartSaga(socket) {
  while (true) {
    // payload === true면 'gameStart', payload === false면 'gameFinish'
    const { payload } = yield take(SET_GAME_START);
    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['setGameStart', code, payload]);
  }
}

function* setTimeLimitSaga(socket) {
  while (true) {
    const { payload } = yield take(SET_TIME_LIMIT);
    const code = yield select(state => state.room.code);
    const round = yield select(state => state.room.round);

    yield apply(socket, socket.emit, ['setRoom', code, round, payload]);
  }
}

function* setGameReadySaga(socket) {
  while (true) {
    yield take(SET_GAME_READY);

    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['ready', name, code]);
  }
}

function* setGameStartSuccessSaga() {
  while (true) {
    yield take(SET_GAME_START_SUCCESS);

    const code = yield select(state => state.room.code);
    
    yield put(push(`/room/${code}/upload`));
  }
}


function* handleSocket(socket) {
  yield fork(read, socket);

  yield fork(setRoundSaga, socket);
  yield fork(setTimeLimitSaga, socket);
  yield fork(setGameReadySaga, socket);
  yield fork(setGameStartSaga, socket);
  yield fork(setGameStartSuccessSaga);
}

function* fetchRoomCodeSaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const actions = yield take(FETCH_ROOM_CODE);
      const payload = actions.payload;

      const response = yield call(createRoom, payload);
      const socket = yield call(socketConnection);

      yield fork(handleSocket, socket);
      yield apply(socket, socket.emit, ['join', payload.name, response.data.roomCode]);
      
      yield put(fetchRoomCodeSuccess({ ...response, ...payload }));
      yield put(push(`/room/${response.data.roomCode}`, { code: response.data.roomCode }));
    } catch (error) {
      yield put(fetchRoomCodeFailure(error));
    }
  }
  
}

function* checkRoomCodeSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    // const actions = yield take(CHECK_ROOM_CODE);
    // const payload = actions.payload;

    const response = yield call(checkRoomCode, payload);
    yield put(checkRoomCodeSuccess({ ...response, ...payload }));
  } catch (error) {
    yield put(checkRoomCodeFailure(error));
    yield put(push(`/`));
  }
  
}


function* connectRoomSaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const { payload } = yield take(CONNECT_ROOM);
      
      const response = yield call(connectRoom, payload);
      const socket = yield call(socketConnection);

      yield fork(handleSocket, socket);
      yield apply(socket, socket.emit, ['join', payload.name, payload.code]); 
  
      yield put(connectRoomSuccess({ ...response, ...payload }));
      yield put(push(`/room/${payload.code}`, { name: payload.name, code: payload.code }));
  
    } catch (error) {
      yield put(connectRoomFailure({ ...error }));
      yield put(push(`/`));
    }
  }
}

function* imageReadySaga() {
  // const { payload } = action;
  // if (!payload) return;

  try {
    const { payload } = yield take(IMAGE_READY);

    const response = yield call(imageReady, payload);
    yield console.log(response);
    yield put(imageReadySuccess({ ...response }));
    yield put(setGameReady());
  } catch (error) {
    yield put(imageReadyFailure({ ...error }));
  }
}

export default function* roomSaga() {
  yield fork(fetchRoomCodeSaga);
  yield fork(connectRoomSaga);
  yield takeLatest(CHECK_ROOM_CODE, checkRoomCodeSaga);
  yield takeEvery(IMAGE_READY, imageReadySaga);
}
