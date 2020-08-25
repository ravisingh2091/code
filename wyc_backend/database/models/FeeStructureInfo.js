module.exports = (sequelize, DataTypes) => {
    const FeeStructure = require('./FeeStructure')(sequelize, DataTypes);
    const FeeCategory = require('./FeeCategory')(sequelize, DataTypes);
    const FeeHead = require('./FeeHead')(sequelize, DataTypes);

    const FeeStructureInfo = sequelize.define('FeeStructureInfo',
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
            fee_structure_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            fee_head_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            fee_category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            first_due_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            }
        }, {
            tableName: 'fee_structure_info',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    FeeStructureInfo.belongsTo(FeeStructure, { as: 'feeStructure', foreignKey: 'fee_structure_id' });
    FeeStructureInfo.belongsTo(FeeHead, { as: 'feeHead', foreignKey: 'fee_head_id' });
    FeeStructureInfo.belongsTo(FeeCategory, { as: 'feeCategory', foreignKey: 'fee_category_id' });
    return FeeStructureInfo;
};
