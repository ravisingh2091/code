module.exports = (sequelize, DataTypes) => {
    const FeeInvoice = require('./FeeInvoice')(sequelize, DataTypes);
    const FeeHead = require('./FeeHead')(sequelize, DataTypes);

    const FeeInvoiceInfo = sequelize.define('FeeInvoiceInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            fee_head_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            }
        }, {
            tableName: 'fee_invoice_info',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    FeeInvoiceInfo.belongsTo(FeeInvoice, { as: 'feeInvoice', foreignKey: 'invoice_id' });
    FeeInvoiceInfo.belongsTo(FeeHead, { as: 'feeHead', foreignKey: 'fee_head_id' });
    return FeeInvoiceInfo;
};
