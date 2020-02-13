const { Room, User } = require('../models');

const findRoom = async (code) => {
    const existingRoom = await Room.findAll({where: {code: code}});

    if(existingRoom) {
        return true;
    } else {
        return false;
    }
}

const addRoom = async (code) => {
    const result = await Room.create({code: code});
    return result;
}

const addUser = async (name, roomCode) => {
    const result = await User.create({name: name, roomCode: roomCode});
    return result;
}

const findUser = async (name, roomCode) => {

}

const getUsersInRoom = async (roomCode) => {

}

const setRoom = async (roomCode, round, time) => {

}

const getRoomSetting = async (roomCode) => {

}

const setUserScore = async (name, roomCode, score) => {
    const result = await User.update( {score: score}, { where: {name: name, roomCpde: roomCode} });
    return result;
}

const getUserScore = async (name, roomCode) => {

}

const deleteRoom = async (roomCode) => {
    const result = await Room.delete({ where: {code: roomCode} });
    return result;
}

const deleteUser = async (name, roomCode) => {
    const result = await User.delete({ where: {name: name, roomCode: roomCode}});
    return result;
}

module.exports = { findRoom, addRoom, addUser, findUser, getUsersInRoom, setRoom, getRoomSetting, setUserScore, getUserScore, deleteRoom, deleteUser };