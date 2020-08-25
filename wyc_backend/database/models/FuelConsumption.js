module.exports = (sequelize, DataTypes) => {
    const Vehicle = require('./Vehicle')(sequelize, DataTypes);
    const Employee = require('./Employee')(sequelize, DataTypes);

    const FuelConsumption = sequelize.define('FuelConsumption',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            quantity: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            current_reading: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            driver: {
                type: DataTypes.STRING,
                allowNull: false
            },
            added_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: 'fuel_consumption',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    FuelConsumption.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicle_id' });
    FuelConsumption.belongsTo(Employee, { as: 'employee', foreignKey: 'added_by' });
    return FuelConsumption;
};
