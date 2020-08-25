module.exports = (sequelize, DataTypes) => {
    const Route = require('./Route')(sequelize, DataTypes);
    const Vehicle = require('./Vehicle')(sequelize, DataTypes);
    const Driver = require('./Driver')(sequelize, DataTypes);

    const VehicleAllocation = sequelize.define('RouteVehicle',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            route_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            driver_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            conductor_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            no_of_slot: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            latitude: {
                type: DataTypes.STRING,
                allowNull: true
            },
            longitude: {
                type: DataTypes.STRING,
                allowNull: true
            },
            bus_way: {
                type: DataTypes.ENUM('Pick', 'Drop'),
                allowNull: true
            },
            slot:{
                type: DataTypes.STRING,
                allowNull: true
            },
            last_stop_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            last_stop_time:{
                type: DataTypes.TIME,
                allowNull: true
            },
            start_time:{
                type: DataTypes.TIME,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Start', 'Stop'),
                allowNull: false,
                defaultValue: 'Stop'
            }
        }, {
            tableName: 'route_vehicle',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    VehicleAllocation.belongsTo(Route, { as: 'route', foreignKey: 'route_id' });
    VehicleAllocation.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicle_id' });
    VehicleAllocation.belongsTo(Driver, { as: 'driver', foreignKey: 'driver_id' });
    VehicleAllocation.belongsTo(Driver, { as: 'conductor', foreignKey: 'conductor_id' });

    return VehicleAllocation;
};
