module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Holiday = sequelize.define('Holiday', {
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
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        no_of_days: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'holiday',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

    Holiday.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    return Holiday;
};
