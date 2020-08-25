module.exports = (sequelize, DataTypes) => {
    const Parent = sequelize.define('Parent',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            father_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mother_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            contact_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            father_aadhar_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mother_aadhar_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            father_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mother_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            father_qualification: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mother_qualification: {
                type: DataTypes.STRING,
                allowNull: true
            },
            father_occupation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mother_occupation: {
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
            }
        }, {
            tableName: 'parent',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        });
    return Parent;
};
