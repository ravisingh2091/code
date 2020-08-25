module.exports = (sequelize, DataTypes) =>
    sequelize.define('Board', {
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
        tableName: 'board',
        timestamps: false
    });
