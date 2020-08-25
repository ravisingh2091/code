module.exports = (sequelize, DataTypes) => {
    const PatternTerm = require('./PatternTerm')(sequelize, DataTypes);
    const Exam = require('./Exam')(sequelize, DataTypes);
    const PatternExam = sequelize.define('PatternExam',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pattern_term_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            exam_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            no_of_test: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            test_consider: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            max_mark: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pass_percentage: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            weightage: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'pattern_exam',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    PatternExam.belongsTo(PatternTerm, { as: 'patternTerm', foreignKey: 'pattern_term_id' });
    PatternExam.belongsTo(Exam, { as: 'exam', foreignKey: 'exam_id' });
    return PatternExam;
};
