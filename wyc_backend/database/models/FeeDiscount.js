module.exports = (sequelize, DataTypes) => {
     const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const FeeDiscount = sequelize.define('FeeDiscount',
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
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('Discount', 'Penalty'),
                defaultValue: true
            },
            status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: true
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            tableName: 'fee_discount',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
 FeeDiscount.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return FeeDiscount;
};