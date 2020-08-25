module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Countries', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sortname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phonecode:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'countries',
        timestamps: false
    });
};
