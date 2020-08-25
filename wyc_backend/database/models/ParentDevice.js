module.exports = (sequelize, DataTypes) => {
    const ParentDevice = sequelize.define('ParentDevice', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        device_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imei: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: true
        }
    }, {
        tableName: 'parent_device',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return ParentDevice;
};
