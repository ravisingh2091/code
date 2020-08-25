module.exports = (sequelize, DataTypes) => {
    const ScheduleTerm = require('./ScheduleTerm')(sequelize, DataTypes);
    const PatternExam = require('./PatternExam')(sequelize, DataTypes);
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);
    const ScheduleExam = sequelize.define('ScheduleExam',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_term_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pattern_exam_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            publish_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Schedule', 'Progress', 'Publish'),
                defaultValue: 'Schedule'
            }
        }, {
            tableName: 'schedule_exam',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    ScheduleExam.belongsTo(ScheduleTerm, { as: 'scheduleTerm', foreignKey: 'schedule_term_id' })
    ScheduleExam.belongsTo(PatternExam, { as: 'patternExam', foreignKey: 'pattern_exam_id' });
    ScheduleExam.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    ScheduleExam.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    return ScheduleExam;
};
