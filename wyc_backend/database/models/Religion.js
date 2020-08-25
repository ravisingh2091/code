module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Religion', {
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
        tableName: 'religion',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
