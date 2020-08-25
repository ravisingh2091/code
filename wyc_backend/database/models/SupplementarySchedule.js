module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes),
        ScheduleExam = require('./ScheduleExam')(sequelize, DataTypes),
        Subject = require('./Subject')(sequelize, DataTypes),
        SupplementarySchedule = sequelize.define('SupplementarySchedule',
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                student_section_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                schedule_exam_id: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                subject_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                date: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                mark: {
                    type: DataTypes.DECIMAL(11, 2),
                    allowNull: true
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
                tableName: 'supplementary_schedule',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            });
    SupplementarySchedule.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'student_section_id' });
    SupplementarySchedule.belongsTo(ScheduleExam, { as: 'scheduleExam', foreignKey: 'schedule_exam_id' });
    SupplementarySchedule.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return SupplementarySchedule;
};
