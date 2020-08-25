module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);

    const MsgAllocation = sequelize.define('MsgAllocation', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        no_of_msg: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: false
        }
    }, {
        tableName: 'msg_allocation',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    MsgAllocation.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
    return MsgAllocation;
};
