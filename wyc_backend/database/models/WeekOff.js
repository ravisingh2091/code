module.exports = (sequelize, DataTypes) => {
    const WeekOff = sequelize.define('WeekOff', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        calendar_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'week_off',
        timestamps: false
    });
    return WeekOff;
};
