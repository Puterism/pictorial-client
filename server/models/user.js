module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        roomCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0,
        },
        is_ready: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        }
    }, {
        timestamps: false
    });
};