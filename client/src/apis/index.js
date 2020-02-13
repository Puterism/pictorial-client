import axios from 'axios';

export function createRoom(payload) {
  try {
    const response = axios.post('/create', payload);
    return response;
  } catch (error) {
    return error;
  }
}