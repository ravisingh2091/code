module.exports = (sequelize, DataTypes) => {
    const Route = require('./Route')(sequelize, DataTypes);
    const Stops = require('./Stops')(sequelize, DataTypes);

    const RouteStop = sequelize.define('RouteStop',
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
            stop_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pick_order: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            drop_order: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'route_stop',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    RouteStop.belongsTo(Route, { as: 'route', foreignKey: 'route_id' });
    RouteStop.belongsTo(Stops, { as: 'stops', foreignKey: 'stop_id' });
    return RouteStop;
};
