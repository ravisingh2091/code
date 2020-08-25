module.exports = (sequelize, DataTypes) => {
    const PatternTest = require('./PatternTest')(sequelize, DataTypes);
    const ScheduleExam = require('./ScheduleExam')(sequelize, DataTypes);
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);

    const ScheduleTest = sequelize.define('ScheduleTest',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_exam_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pattern_test_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            publish_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Schedule', 'Progress', 'Complete', 'Ready', 'Publish'),
                defaultValue: 'Schedule'
            }
        }, {
            tableName: 'schedule_test',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    ScheduleTest.belongsTo(PatternTest, { as: 'patternTest', foreignKey: 'pattern_test_id' });
    ScheduleTest.belongsTo(ScheduleExam, { as: 'scheduleExam', foreignKey: 'schedule_exam_id' });
    ScheduleTest.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    ScheduleTest.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    return ScheduleTest;
};
