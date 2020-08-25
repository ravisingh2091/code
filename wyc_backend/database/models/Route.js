module.exports = (sequelize, DataTypes) => {
    const Route = sequelize.define('Route',
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
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: 'route',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return Route;
};
