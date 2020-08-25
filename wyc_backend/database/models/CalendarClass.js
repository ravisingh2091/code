module.exports = (sequelize, DataTypes) => {
    const Calendar = require('./Calendar')(sequelize, DataTypes);
    const Class = require('./Class')(sequelize, DataTypes);

    const CalendarClass = sequelize.define('CalendarClass',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            calendar_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'calendar_class',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
            deletedAt: false
        });
    CalendarClass.belongsTo(Calendar, { as: 'calendar', foreignKey: 'calendar_id' });
    CalendarClass.belongsTo(Class, { as: 'class', foreignKey: 'class_id' });
    return CalendarClass;
};
