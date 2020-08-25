module.exports = (sequelize, DataTypes) => {
    const Section = require('./Section')(sequelize, DataTypes);
    const Message = require('./Message')(sequelize, DataTypes);

    const MessageRecipient = sequelize.define('MessageRecipient', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        section_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'message_recipient',
        timestamps: false
    });

    MessageRecipient.belongsTo(Section, {as: 'section', foreignKey: 'section_id'});
    MessageRecipient.belongsTo(Message, {as: 'message', foreignKey: 'message_id'});
    return MessageRecipient;
};
