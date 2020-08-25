module.exports = (sequelize, DataTypes) => {
    const SchoolSubscription = sequelize.define('SchoolSubscription',
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
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            fee: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
            attendance: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
            homework: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
            exam: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
            messaging: {
                type: DataTypes.INTEGER,
                defaultValue: true
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: true
            }
        }, {
            tableName: 'school_subscription',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return SchoolSubscription;
};
