module.exports = (sequelize, DataTypes) => {
    const ExamMark = require('./ExamMark')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);
    const ExamMarkInfo = sequelize.define('ExamMarkInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            exam_mark_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mark: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            
            mark_type: {
                type: DataTypes.ENUM('Exam', 'Supplementary'),
                defaultValue: 'Exam'
            },
            status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            }
        }, {
            tableName: 'exam_mark_info',
            timestamps: false
        });
    ExamMarkInfo.belongsTo(ExamMark, { as: 'examMark', foreignKey: 'exam_mark_id' });
    ExamMarkInfo.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return ExamMarkInfo;
};
