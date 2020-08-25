module.exports = function (sequelize, DataTypes) {
    return sequelize.define('UserType', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'user_type',
        timestamps:false
    });
};
