module.exports = (sequelize, DataTypes) => {
    const Employee = require('./Employee')(sequelize, DataTypes);
    const EmployeeAttendance = sequelize.define('EmployeeAttendance',
        {
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            in_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            out_time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            created_by:{
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            tableName: 'employee_attendance',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    EmployeeAttendance.belongsTo(Employee, { as: 'employee', foreignKey: 'employee_id' });
    return EmployeeAttendance;
};
