module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Occupation', {
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
        tableName: 'occupation',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
