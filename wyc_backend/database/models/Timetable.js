module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TimeTable', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summer_start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        winter_start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        no_of_days:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        no_of_period: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'timetable',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt:'updated_at'
    });
};
