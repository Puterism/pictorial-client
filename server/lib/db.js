const { Room, User, ImageInfo, GameData } = require('../models');

const findRoom = async (code) => {
    const existingRoom = await Room.findAll({where: {code: code}});
    console.log('result: ', existingRoom);

    if(existingRoom.length > 0) {
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
    const existingUser = await User.findAll({ where: {name: name, roomCode: roomCode} });

    if(existingUser.length > 0) {
        return { error: '이미 존재하는 이름입니다.'};
    } else {
        return false;
    }
}

const getUsersInRoom = async (roomCode) => {
    const result = await Room.findAndCount({ where: {roomCode: roomCode} });
    return result;
}

const setRoom = async (roomCode, round, time) => {
    const result = await Room.update( {round: round, time: time}, { where: {romCode: roomCode} });
    return result;
}

const getRoomSetting = async (roomCode) => {
    const result = await Room.findOne({ where: {code: roomCode} });
    return result;
}

const setUserScore = async (name, roomCode, score) => {
    const result = await User.update( {score: score}, { where: {name: name, roomCpde: roomCode} });
    return result;
}

const getUserScore = async (name, roomCode) => {
    const result = await User.findOne( {score: score}, { where: {name: name, roomCpde: roomCode} });
    return result;
}

const deleteRoom = async (roomCode) => {
    const result = await Room.delete({ where: {code: roomCode} });
    return result;
}

const deleteUser = async (name, roomCode) => {
    const result = await User.delete({ where: {name: name, roomCode: roomCode}});
    return result;
}

const insertImg = async (name, roomCode, imageName, base64Img, answerAuto) => {
    const result1 = await ImageInfo.create({name: name, roomCode: roomCode, imageName: imageName});
    const result2 = await GameData.create({imageName: imageName, answerAuto: answerAuto, base64Img: base64Img});
}

module.exports = { findRoom, addRoom, addUser, findUser, getUsersInRoom, setRoom, getRoomSetting, setUserScore, getUserScore, deleteRoom, deleteUser, insertImg };