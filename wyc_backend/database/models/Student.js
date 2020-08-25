module.exports = (sequelize, DataTypes) => {
    const Parent = require('./Parent')(sequelize, DataTypes);
    const FeeCategory = require('./FeeCategory')(sequelize, DataTypes);
    const RouteStop = require('./RouteStop')(sequelize, DataTypes);
    const RouteVehicle = require('./RouteVehicle')(sequelize, DataTypes);

    const Student = sequelize.define('Student',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            admission_no: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
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
            barcode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            admission_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            house: {
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
            trans_invoice_till_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            trans_due_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            trans_payable_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            fee_category_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            due_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            payable_amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            invoice_generated_till_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            aadhar_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_proof: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_proof_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            blood_group: {
                type: DataTypes.STRING,
                allowNull: true
            },
            photo_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            photo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '1'
            }
        }, {
            tableName: 'student',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    Student.belongsTo(Parent, { as: 'parent', foreignKey: 'parent_id' });
    Student.belongsTo(FeeCategory, { as: 'feeCategory', foreignKey: 'fee_category_id' });
    Student.belongsTo(RouteStop, { as: 'routeStop', foreignKey: 'route_stop_id' });
    Student.belongsTo(RouteVehicle, { as: 'routeVehicle', foreignKey: 'route_vehicle_id' });
    return Student;
};
