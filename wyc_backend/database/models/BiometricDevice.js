module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const BiometricDevice = sequelize.define('BiometricDevice',
        {
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
            device_id: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'biometric_device',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    BiometricDevice.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return BiometricDevice;
};  
