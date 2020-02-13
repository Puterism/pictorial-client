import axios from 'axios';

export function createRoom(payload) {
  try {
    const response = axios.post('/create', payload);
    return response;
  } catch (error) {
    return error;
  }
}

export function checkRoomCode(payload) {
  try {
    const response = axios.post('/invite', { roomCode: payload });
    return response;
  } catch (error) {
    return error;
  }
}

export function connectRoom(payload) {
  try {
    const response = axios.post('/joinRoom', { name: payload.name, roomCode: payload.code });
    return response;
  } catch (error) {
    return error;
  }
}