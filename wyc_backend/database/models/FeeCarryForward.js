module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const FeeCarryForward = sequelize.define('FeeCarryForward',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            student_section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: '0'
            }
        }, {
            tableName: 'fee_carry_forward',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    FeeCarryForward.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return FeeCarryForward;
};
