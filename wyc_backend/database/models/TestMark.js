module.exports = (sequelize, DataTypes) => {
    const ScheduleTest = require('./ScheduleTest')(sequelize, DataTypes);
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);
    const TestMark = sequelize.define('TestMark',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_test_id: {
                type: DataTypes.INTEGER,
                allowNull: false
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
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            }
        }, {
            tableName: 'test_mark',
            timestamps: false
        });
    TestMark.belongsTo(ScheduleTest, { as: 'scheduleTest', foreignKey: 'schedule_test_id' });
    TestMark.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'stu_sec_id' });
    TestMark.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return TestMark;
};
