module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const RouteVehicle = require('./RouteVehicle')(sequelize, DataTypes);
    const Stops = require('./Stops')(sequelize, DataTypes);

    const TransportComm = sequelize.define('TransportComm',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            route_vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            stop_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            msg_to: {
                type: DataTypes.ENUM('All', 'RouteVehicle', 'Stop'),
                allowNull: false
            },
            msg_type: {
                type: DataTypes.ENUM('Message', 'Push'),
                allowNull: false
            }
        }, {
            tableName: 'trans_comm',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    TransportComm.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    TransportComm.belongsTo(RouteVehicle, { as: 'routeVehicle', foreignKey: 'route_Vehicle_id' });
    TransportComm.belongsTo(Stops, { as: 'stops', foreignKey: 'stop_id' });
    return TransportComm;
};
