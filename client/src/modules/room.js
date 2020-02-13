// action types
export const FETCH_ROOM_CODE = 'room/FETCH_ROOM_CODE';
export const FETCH_ROOM_CODE_SUCCESS = 'room/FETCH_ROOM_CODE_SUCCESS';
export const FETCH_ROOM_CODE_FAILURE = 'room/FETCH_ROOM_CODE_FAILURE';

export const CONNECT_ROOM = 'room/CONNECT_ROOM';
export const CONNECT_ROOM_SUCCESS = 'room/CONNECT_ROOM_SUCCESS';
export const CONNECT_ROOM_FAILURE = 'room/CONNECT_ROOM_FAILURE';


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
    name: name,
    code: code,
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
      }
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
        ...payload.data,
        connected: true,
      };

    case CONNECT_ROOM_FAILURE:
      return {
        ...state,
        ...payload.response.data,
        connected: false,
        showError: true,
      };

    default:
      return state;
  }
}

export default room;