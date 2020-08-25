module.exports = (sequelize, DataTypes) =>
    sequelize.define('Module', {
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
        tableName: 'module',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
