module.exports = (sequelize, DataTypes) => {
    const StudentSection = require('./StudentSection')(sequelize, DataTypes),
        ScheduleSection = require('./ScheduleSection')(sequelize, DataTypes),
         SubTestMark = require('./SubTestMark')(sequelize, DataTypes);

    const SectionMark = sequelize.define('SectionMark',
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
            stu_sec_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mark: {
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
            tableName: 'section_mark',
            timestamps: false
        });
    SectionMark.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'stu_sec_id' });
    SectionMark.belongsTo(SubTestMark, { as: 'sub_test_mark', foreignKey: 'stu_sec_id' });
    SectionMark.belongsTo(ScheduleSection, { as: 'scheduleSection', foreignKey: 'schedule_section_id' });
    return SectionMark;
};
