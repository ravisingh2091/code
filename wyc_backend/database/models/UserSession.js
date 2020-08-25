module.exports = (sequelize, DataTypes) => {
    const User = require('./User')(sequelize, DataTypes);

    const UserSession = sequelize.define('UserSession', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        session_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: true
        }
    }, {
        tableName: 'user_session',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false

    });

    UserSession.belongsTo(User, {as: 'user', foreignKey: 'user_id'});
    return UserSession;
};
