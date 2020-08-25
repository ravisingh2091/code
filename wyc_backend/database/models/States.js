module.exports = (sequelize, DataTypes) => {
    return sequelize.define('States', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'states',
        timestamps: false
    });
};
