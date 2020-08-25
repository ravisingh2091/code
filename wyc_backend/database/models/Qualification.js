module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Qualification', {
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
        tableName: 'qualification',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
