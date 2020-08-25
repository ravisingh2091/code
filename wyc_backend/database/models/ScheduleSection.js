module.exports = (sequelize, DataTypes) => {
    const Pattern = require('./Pattern')(sequelize, DataTypes);
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);
    const ScheduleSection = sequelize.define('ScheduleSection',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pattern_id: {
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
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Progress', 'Publish'),
                defaultValue: 'Progress'
            }
        }, {
            tableName: 'schedule_section',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        
    ScheduleSection.belongsTo(Pattern, { as: 'pattern', foreignKey: 'pattern_id' });
    ScheduleSection.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    ScheduleSection.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    return ScheduleSection;
};
