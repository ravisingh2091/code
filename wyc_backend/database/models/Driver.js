module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define('Driver',
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
            mobile_no: {
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
            license_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            joining_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            aadhar_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            imei: {
                type: DataTypes.STRING,
                allowNull: true
            },
            salary: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true
            },
            present_street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            present_city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            present_state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            present_country: {
                type: DataTypes.STRING,
                allowNull: false
            },
            present_pincode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parmanent_street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parmanent_city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parmanent_state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parmanent_country: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parmanent_pincode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('Driver', 'Conductor'),
                allowNull: false,
                defaultValue: 'Driver'
            },
            photo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 1
            }
        }, {
            tableName: 'driver',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return Driver;
};
