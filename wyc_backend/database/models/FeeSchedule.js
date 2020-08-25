module.exports = (sequelize, DataTypes) => {
    const FeeStructureInfo = require('./FeeStructureInfo')(sequelize, DataTypes);
    const FeeSchedule = sequelize.define('FeeSchedule',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            fee_structure_info_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            generate_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            }
        }, {
            tableName: 'fee_schedule',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });
    FeeSchedule.belongsTo(FeeStructureInfo, { as: 'feeStructureInfo', foreignKey: 'fee_structure_info_id' });
    return FeeSchedule;
};
