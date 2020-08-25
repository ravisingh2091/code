module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Employee = require('./Employee')(sequelize, DataTypes);

    const NoticeBoard = sequelize.define('NoticeBoard', {
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
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recipient_type: {
            type: DataTypes.ENUM('Parent', 'Employee'),
            defaultValue: true
        }
    }, {
        tableName: 'notice_board',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    NoticeBoard.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    NoticeBoard.belongsTo(Employee, {as: 'employee', foreignKey: 'sender_id'});
    return NoticeBoard;
};
