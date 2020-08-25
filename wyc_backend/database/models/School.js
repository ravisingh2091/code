module.exports = (sequelize, DataTypes) => {
    return sequelize.define('School', {
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
        tableName: 'school',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
