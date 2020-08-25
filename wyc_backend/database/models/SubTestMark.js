module.exports = (sequelize, DataTypes) => {
    const ScheduleSubTestInfo = require('./ScheduleSubTestInfo')(sequelize, DataTypes);
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const SubTestMark = sequelize.define('SubTestMark',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_sub_test_info_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            stu_sec_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mark: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Present', 'Absent'),
                defaultValue: 'Present'
            }
        }, {
            tableName: 'sub_test_mark',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    SubTestMark.belongsTo(ScheduleSubTestInfo, { as: 'scheduleSubTestInfo', foreignKey: 'schedule_sub_test_info_id' });
    SubTestMark.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'stu_sec_id' });
    return SubTestMark;
};
