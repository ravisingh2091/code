module.exports = (sequelize, DataTypes) => {
    const Stops = sequelize.define('Stops',
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
            latitude: {
                type: DataTypes.STRING,
                allowNull: true
            },
            longitude: {
                type: DataTypes.STRING,
                allowNull: true
            },
            stu_one_fee: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            stu_both_fee: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            teach_one_fee: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            teach_both_fee: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: 'stops',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return Stops;
};
