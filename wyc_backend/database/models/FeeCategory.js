module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FeeCategory', {
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
        }
    }, {
        tableName: 'fee_category',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
