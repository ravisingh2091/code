module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);

    const FeeInvoice = sequelize.define('FeeInvoice',
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
            generate_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            from_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            to_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            unpaid_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            next_late_fee_due_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            invoice_status: {
                type: DataTypes.ENUM('Open', 'Close'),
                defaultValue: 'Open'
            }
        }, {
            tableName: 'fee_invoice',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    FeeInvoice.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return FeeInvoice;
};
