module.exports = (sequelize, DataTypes) => {
    return sequelize.define('House',
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
            }
        },
        {
            tableName: 'house',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });
};
