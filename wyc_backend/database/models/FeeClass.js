module.exports = (sequelize, DataTypes) => {
    const FeeStructure = require('./FeeStructure')(sequelize, DataTypes);
    const Class = require('./Class')(sequelize, DataTypes);

    const FeeClass = sequelize.define('FeeClass',
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
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'fee_class',
            timestamps: false
        }
    );
    FeeClass.belongsTo(FeeStructure, { as: 'feeStructure', foreignKey: 'fee_structure_id' });
    FeeClass.belongsTo(Class, { as: 'class', foreignKey: 'class_id' });
    return FeeClass;
};
