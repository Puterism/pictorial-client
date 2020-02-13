module.exports = (wequelize, DataTypes) => {
    return wequelize.define('imageInfo', {
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        roomCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        imageName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: false,
    });
};