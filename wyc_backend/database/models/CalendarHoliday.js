module.exports = (sequelize, DataTypes) => {
    const Calendar = require('./Calendar')(sequelize, DataTypes);
    const Holiday = require('./Holiday')(sequelize, DataTypes);
    const CalendarHoliday = sequelize.define('CalendarHoliday', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        calendar_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        holiday_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'calendar_holiday',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false
    });

    CalendarHoliday.belongsTo(Calendar, { as: 'calendar', foreignKey: 'calendar_id' });
    CalendarHoliday.belongsTo(Holiday, { as: 'holiday', foreignKey: 'holiday_id' });
    return CalendarHoliday;
};
