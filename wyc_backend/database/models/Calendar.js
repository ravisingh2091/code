module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);    
    const Calendar = sequelize.define('Calendar', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        week_off: {
            type: DataTypes.ENUM('All', 'No', 'Alternate'),
            allowNull: false
        },
        alternate_first_off: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'calendar',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

    Calendar.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    return Calendar;
};
