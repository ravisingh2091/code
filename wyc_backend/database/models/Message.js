module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);

    const Message = sequelize.define('Message', {
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
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recipient_type: {
            type: DataTypes.ENUM('Employee', 'Parent'),
            defaultValue: true
        }
    }, {
        tableName: 'message',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Message.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    return Message;
};
