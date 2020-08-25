module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Student = require('./Student')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);

    const StudentSection = sequelize.define('StudentSection',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            student_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            roll_no: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            student_type: {
                type: DataTypes.ENUM('OLD', 'NEW'),
                defaultValue: true
            },
            status: {
                type: DataTypes.ENUM('STUDYING', 'PASS', 'FAIL', 'COMPLETED', 'TRANSFER'),
                defaultValue: true
            },
            exam_status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: true
            }
        }, {
            tableName: 'student_section',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        });

    StudentSection.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    StudentSection.belongsTo(Student, { as: 'student', foreignKey: 'student_id' });
    StudentSection.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    return StudentSection;
};
