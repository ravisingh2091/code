module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);

    const StudentAttendance = sequelize.define('StudentAttendance', {
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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'student_attendance',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    
    StudentAttendance.belongsTo(StudentSection, {as: 'studentSection', foreignKey: 'student_section_id'});
    return StudentAttendance;
};
