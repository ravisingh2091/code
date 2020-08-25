module.exports = (sequelize, DataTypes) => {
    const ScheduleTerm = require('./ScheduleTerm')(sequelize, DataTypes);
    const StudentSection = require('./StudentSection')(sequelize, DataTypes);
    const TermMark = sequelize.define('TermMark',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_term_id: {
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
            status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            tableName: 'term_mark',
            timestamps: false
        });
    TermMark.belongsTo(ScheduleTerm, { as: 'scheduleTerm', foreignKey: 'schedule_term_id' });
    TermMark.belongsTo(StudentSection, { as: 'studentSection', foreignKey: 'stu_sec_id' });
    return TermMark;
};
