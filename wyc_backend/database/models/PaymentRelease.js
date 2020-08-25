module.exports = (sequelize, DataTypes) => {
    const PaymentRelease = sequelize.define('PaymentRelease',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            fee_payment_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            merchant_key: {
                type: DataTypes.STRING,
                allowNull: false
            },
            merchant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            merchant_transaction_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total_amount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            aggregator_sub_transaction_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            payment_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: DataTypes.ENUM('Fee', 'Transport'),
                defaultValue: 'Fee'
            },
            status: {
                type: DataTypes.ENUM('Progress', 'Complete'),
                defaultValue: 'Progress'
            }
        }, {
            tableName: 'payment_release',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return PaymentRelease;
};
