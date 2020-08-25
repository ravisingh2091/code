module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FeeHead',
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
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            periodicity: {
                type: DataTypes.ENUM('Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Once'),
                allowNull: false
            }
        }, {
            tableName: 'fee_head',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
};
