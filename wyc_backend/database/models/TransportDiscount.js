module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);

    const TransportDiscount = sequelize.define('TransportDiscount',
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('Discount', 'Penalty'),
                defaultValue: 'Discount'
            },
            status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: '0'
            },
            trans_invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            tableName: 'trans_discount',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    TransportDiscount.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    return TransportDiscount;
};
