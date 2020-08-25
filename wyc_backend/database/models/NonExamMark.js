module.exports = (sequelize, DataTypes) => {
    const ScheduleSection = require('./ScheduleSection')(sequelize, DataTypes);
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);

    const NonExamMark = sequelize.define('NonExamMark',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            student_section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            remarks:{
                type: DataTypes.STRING,
                allowNull: false
            }
            
        }, {
            tableName: 'non_exam_mark',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    NonExamMark.belongsTo(ScheduleSection, {as: 'scheduleSection', foreignKey: 'schedule_section_id'});
    NonExamMark.belongsTo(StudentSection, {as: 'studentSection', foreignKey: 'student_section_id'});
    NonExamMark.belongsTo(Subject, {as: 'subject', foreignKey: 'subject_id'});
    return NonExamMark;
};
