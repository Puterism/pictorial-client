module.exports = (wequelize, DataTypes) => {
    return wequelize.define('gameData', {
        imageName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        isAuto: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        answerAuto: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        answerManu: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        base64Img: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};