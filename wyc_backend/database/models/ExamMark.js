module.exports = (sequelize, DataTypes) => {
    const ScheduleExam = require('./ScheduleExam')(sequelize, DataTypes);
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const ExamMark = sequelize.define('ExamMark',
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
            stu_sec_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            total_mark: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            }
        }, {
            tableName: 'exam_mark',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });
    ExamMark.belongsTo(ScheduleExam, { as: 'scheduleExam', foreignKey: 'schedule_exam_id' });
    ExamMark.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'stu_sec_id' });
    return ExamMark;
};
