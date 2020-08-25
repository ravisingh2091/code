module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);

    const TransportPayment = sequelize.define('TransportPayment',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            student_section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            payment_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            payment_mode: {
                type: DataTypes.ENUM('Cash', 'Cheque', 'Debit card', 'Credit card', 'Net banking', 'UPI', 'Bank Deposit', 'Others'),
                allowNull: false
            },
            payment_through: {
                type: DataTypes.ENUM('Web', 'Mobile'),
                defaultValue: 'Web'
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            collected_by: {
                type: DataTypes.STRING,
                defaultValue: 'Admin'
            }
        }, {
            tableName: 'trans_payment',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    TransportPayment.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return TransportPayment;
};
