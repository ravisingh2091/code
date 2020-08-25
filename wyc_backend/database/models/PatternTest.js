module.exports = (sequelize, DataTypes) => {
    const PatternExam = require('./PatternExam')(sequelize, DataTypes);
    const Test = require('./Test')(sequelize, DataTypes);
    const PatternTest = sequelize.define('PatternTest',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pattern_exam_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            test_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            max_mark:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pass_percentage: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'pattern_test',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        });

    PatternTest.belongsTo(PatternExam, { as: 'patternExam', foreignKey: 'pattern_exam_id' });
    PatternTest.belongsTo(Test, { as: 'test', foreignKey: 'test_id' });
    return PatternTest;
};
