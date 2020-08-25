module.exports = (sequelize, DataTypes) => {
    const Section = require('./Section')(sequelize, DataTypes);
    const NoticeBoard = require('./NoticeBoard')(sequelize, DataTypes);

    const NoticeRecipient = sequelize.define('NoticeRecipient', {
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
        notice_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'notice_recipient',
        timestamps: false
    });

    NoticeRecipient.belongsTo(Section, {as: 'section', foreignKey: 'section_id'});
    NoticeRecipient.belongsTo(NoticeBoard, {as: 'noticeBoard', foreignKey: 'notice_id'});
    return NoticeRecipient;
};
