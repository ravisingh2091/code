module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const UserType = require('./UserType')(sequelize, DataTypes);
    const RouteStop = require('./RouteStop')(sequelize, DataTypes);
    const RouteVehicle = require('./RouteVehicle')(sequelize, DataTypes);
    //const Employee = require('./Employee')(sequelize, DataTypes);

    const Employee = sequelize.define('Employee',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            branch_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            father_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            husband_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            contact_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            gender: {
                type: DataTypes.ENUM('Male', 'Female'),
                allowNull: false
            },
            aadhar_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            id_proof: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_proof_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            barcode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            biometric_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mode_of_transport: {
                type: DataTypes.ENUM('Self', 'Bus'),
                defaultValue: true
            },
            route_stop_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            route_vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            slot: {
                type: DataTypes.STRING,
                allowNull: true
            },
            transport_type: {
                type: DataTypes.ENUM('Oneway-Pick', 'Oneway-Drop', 'Both'),
                allowNull: true
            },
            trans_enable_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            qualification: {
                type: DataTypes.STRING,
                allowNull: true
            },
            blood_group: {
                type: DataTypes.STRING,
                allowNull: true
            },
            religion: {
                type: DataTypes.STRING,
                allowNull: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pincode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            photo_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            photo: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            type_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            calendar_id:{
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
             permission: {
                type:DataTypes.STRING,
                allowNull: true
            },
        }, {
            tableName: 'employee',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        });

    Employee.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    Employee.belongsTo(UserType, { as: 'userType', foreignKey: 'type_id' });
    Employee.belongsTo(RouteStop, { as: 'routeStop', foreignKey: 'route_stop_id' });
    Employee.belongsTo(RouteVehicle, { as: 'routeVehicle', foreignKey: 'route_vehicle_id' });

    return Employee;
};
