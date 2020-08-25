module.exports = (sequelize, DataTypes) => {
    const Employee = require('./Employee')(sequelize, DataTypes);

    const EmployeeProfessionalInfo = sequelize.define('EmployeeProfessionalInfo',
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
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            designation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            joining_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            relieving_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            experience: {
                type: DataTypes.STRING,
                allowNull: true
            },
            salary: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: '1'
            },
            feedback: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            tableName: 'employee_professional_info',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    EmployeeProfessionalInfo.belongsTo(Employee, { as: 'employee', foreignKey: 'employee_id' });
    return EmployeeProfessionalInfo;
};
