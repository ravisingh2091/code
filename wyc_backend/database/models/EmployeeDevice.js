module.exports = (sequelize, DataTypes) => {
    const Employee = require('./Employee')(sequelize, DataTypes);
    const EmployeeDevice = sequelize.define('EmployeeDevice', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        device_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imei: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: true
        }
    },
    {
        tableName: 'employee_device',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    EmployeeDevice.belongsTo(Employee, { as: 'employee', foreignKey: 'employee_id' });
    return EmployeeDevice;
};
