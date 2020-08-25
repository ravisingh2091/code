module.exports = (sequelize, DataTypes) => {
    const Section = require('./Section')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);
    const Employee = require('./Employee')(sequelize, DataTypes);
     const ScheduleTestInfo = require('./ScheduleTestInfo')(sequelize, DataTypes);

    const ClassSubject = sequelize.define('ClassSubject',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            teacher_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            exam_status: {
                type: DataTypes.INTEGER,
                defaultValue: true
            }
        }, {
            tableName: 'class_subject',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
            deletedAt: false
        });
    ClassSubject.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    ClassSubject.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    ClassSubject.belongsTo(Employee, { as: 'employee', foreignKey: 'teacher_id' });
    ClassSubject.belongsTo(ScheduleTestInfo, { as: 'schedule_test_info', foreignKey: 'subject_id' });
    return ClassSubject;
};
