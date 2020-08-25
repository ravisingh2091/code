module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);
    const Pattern = require('./Pattern')(sequelize, DataTypes);

    const ExamSection = sequelize.define('ExamSection',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pattern_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            non_exam_point:{
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'exam_section',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    ExamSection.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    ExamSection.belongsTo(Section, { as: 'section', foreignKey: 'section_id' });
    ExamSection.belongsTo(Pattern, { as: 'pattern', foreignKey: 'pattern_id' });
    return ExamSection;
};
