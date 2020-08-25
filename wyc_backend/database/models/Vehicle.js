module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const Vehicle = sequelize.define('Vehicle',
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
            reg_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            no_of_seat: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            purchanse_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            renew_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            insurance_expiry_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            last_service_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            puc_expiry_date:{
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            service_reading: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            meter_reading: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
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
            vehicle_status: {
                type: DataTypes.ENUM('Start', 'Stop'),
                defaultValue: 'Stop'
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: 'vehicle',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    Vehicle.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return Vehicle;
};
