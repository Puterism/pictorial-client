import axios from 'axios';

const END_POINT = 'https://pictorial.ga';

export function createRoom(payload) {
  try {
    const response = axios.post(`${END_POINT}/create`, payload);
    return response;
  } catch (error) {
    return error;
  }
}

export function checkRoomCode(payload) {
  try {
    const response = axios.post(`${END_POINT}/invite`, { roomCode: payload });
    return response;
  } catch (error) {
    return error;
  }
}

export function connectRoom(payload) {
  try {
    const response = axios.post(`${END_POINT}/joinRoom`, { name: payload.name, roomCode: payload.code });
    return response;
  } catch (error) {
    return error;
  }
}

export function imageUpload(payload) {
  try {
    console.log(payload.image);
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('roomCode', payload.code);
    formData.append('IMG_FILE', payload.image);
    
    const response = axios.post(`${END_POINT}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    return error;
  }
}

export function imageReady(payload) {
  try {
    const response = axios.get(`${END_POINT}/image/ready`, { code: payload.code });
    return response;
  } catch (error) {
    return error;
  }
}