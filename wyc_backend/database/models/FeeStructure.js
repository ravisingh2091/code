module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FeeStructure', {
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
        tableName: 'fee_structure',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};
