module.exports = (sequelize, DataTypes) => {
    const TestMark = require('./TestMark')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);

    const TestMarkInfo = sequelize.define('TestMarkInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            test_mark_id: {
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
            status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            }
        }, {
            tableName: 'test_mark_info',
            timestamps: false
        });
        
    TestMarkInfo.belongsTo(TestMark, { as: 'testMark', foreignKey: 'test_mark_id' });
    TestMarkInfo.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return TestMarkInfo;
};
