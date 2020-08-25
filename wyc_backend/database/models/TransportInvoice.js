module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);

    const TransportInvoice = sequelize.define('TransportInvoice',
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
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
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
            route_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            stop_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            invoice_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            unpaid_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Open', 'Close'),
                defaultValue: 'Open'
            },
        }, {
            tableName: 'trans_invoice',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    TransportInvoice.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return TransportInvoice;
};
