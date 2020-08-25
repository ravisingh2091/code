module.exports = (sequelize, DataTypes) => {
    const ScheduleSection = require('./ScheduleSection')(sequelize, DataTypes);
    const PatternTerm = require('./PatternTerm')(sequelize, DataTypes);
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);
    const ScheduleTerm = sequelize.define('ScheduleTerm',
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
            pattern_term_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            publish_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Schedule', 'Progress', 'Publish'),
                defaultValue: 'Schedule'
            }
        }, {
            tableName: 'schedule_term',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    ScheduleTerm.belongsTo(ScheduleSection, { as: 'scheduleSection', foreignKey: 'schedule_section_id' });
    ScheduleTerm.belongsTo(PatternTerm, { as: 'patternTerm', foreignKey: 'pattern_term_id' });
    ScheduleTerm.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    ScheduleTerm.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    return ScheduleTerm;
};
