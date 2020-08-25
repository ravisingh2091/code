module.exports = (sequelize, DataTypes) => {
    const ScheduleTestInfo = require('./ScheduleTestInfo')(sequelize, DataTypes);
    const ScheduleSubTestInfo = sequelize.define('ScheduleSubTestInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_test_info_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            max_mark: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            start_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            end_time: {
                type: DataTypes.TIME,
                allowNull: false
            }
        }, {
            tableName: 'schedule_sub_test_info',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    ScheduleSubTestInfo.belongsTo(ScheduleTestInfo, { as: 'scheduleTestInfo', foreignKey: 'schedule_test_info_id' });
    return ScheduleSubTestInfo;
};
