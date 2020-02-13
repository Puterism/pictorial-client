// action types
export const FETCH_ROOM_CODE = 'room/FETCH_ROOM_CODE';
export const FETCH_ROOM_CODE_SUCCESS = 'room/FETCH_ROOM_CODE_SUCCESS';
export const FETCH_ROOM_CODE_FAILURE = 'room/FETCH_ROOM_CODE_FAILURE';

export const CONNECT_ROOM = 'room/CONNECT_ROOM';
export const CONNECT_ROOM_SUCCESS = 'room/CONNECT_ROOM_SUCCESS';
export const CONNECT_ROOM_FAILURE = 'room/CONNECT_ROOM_FAILURE';

export const CHECK_ROOM_CODE = 'room/CHECK_ROOM_CODE';
export const CHECK_ROOM_CODE_SUCCESS = 'room/CHECK_ROOM_CODE_SUCCESS';
export const CHECK_ROOM_CODE_FAILURE = 'room/CHECK_ROOM_CODE_FAILURE';

export const SET_NAME = 'room/SET_NAME';
export const SET_CODE = 'room/SET_CODE';

export const JOIN_ROOM_WITH_NAME_SAVE = 'room/JOIN_ROOM_WITH_NAME_SAVE';
export const JOIN_ROOM_WITH_NAME_SAVE_SUCCESS = 'room/JOIN_ROOM_WITH_NAME_SAVE_SUCCESS';
export const JOIN_ROOM_WITH_NAME_SAVE_FAILURE = 'room/JOIN_ROOM_WITH_NAME_SAVE_FAILURE';


// action
export const fetchRoomCode = (name) => ({
  type: FETCH_ROOM_CODE,
  payload: {
    name: name,
  },
});

export const fetchRoomCodeSuccess = (response) => ({
  type: FETCH_ROOM_CODE_SUCCESS,
  payload: response,
});

export const fetchRoomCodeFailure = (response) => ({
  type: FETCH_ROOM_CODE_FAILURE,
  payload: response,
});

export const connectRoom = (name, code) => ({
  type: CONNECT_ROOM,
  payload: {
    name,
    code,
  },
});

export const connectRoomSuccess = (response) => ({
  type: CONNECT_ROOM_SUCCESS,
  payload: response,
});

export const connectRoomFailure = (response) => ({
  type: CONNECT_ROOM_FAILURE,
  payload: response,
});

export const setName = (name) => ({
  type: SET_NAME,
  payload: name,
});

export const setCode = (code) => ({
  type: SET_CODE,
  payload: code,
});

export const checkRoomCode = (code) => ({
  type: CHECK_ROOM_CODE,
  payload: code,
});

const initialState = {
  code: '',
  name: '',
  connected: false,
}

// reducer
function room(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ROOM_CODE:
      return {
        ...state,
        status: 'FETCHING',
      };

    case FETCH_ROOM_CODE_SUCCESS: 
      return {
        ...state,
        ...payload.data,
        name: payload.name,
      };

    case FETCH_ROOM_CODE_FAILURE:
      return {
        ...state,
        ...payload.response.data,
        code: '',
        name: '',
        showError: true,
      };

    case CONNECT_ROOM:
      return {
        ...state,
      };
    
    case CONNECT_ROOM_SUCCESS:
      return {
        ...state,
        ...payload,
        connected: true,
      };

    case CONNECT_ROOM_FAILURE:
      return {
        ...state,
        ...payload,
        errorMsg: payload.response.data.message,
        connected: false,
        showError: true,
      };

    case SET_NAME:
      return {
        ...state,
        name: payload.name,
      };
    
    case SET_CODE:
      return {
        ...state,
        code: payload.code,
      };

    case CHECK_ROOM_CODE:
      return {
        ...state,
      };

    case CHECK_ROOM_CODE_SUCCESS:
      return {
        ...state,
        ...payload,
      };

    case CHECK_ROOM_CODE_FAILURE:
      return {
        ...state,
        ...payload,
        errorMsg: payload.response.data.message,
        connected: false,
        showError: true,
      };

    default:
      return state;
  }
}

export default room;