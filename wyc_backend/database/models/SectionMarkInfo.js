module.exports = (sequelize, DataTypes) => {
    const SectionMark = require('./SectionMark')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);

    const SectionMarkInfo = sequelize.define('SectionMarkInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            section_mark_id: {
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
            grade: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Pass', 'Fail'),
                allowNull: false
            }
        }, {
            tableName: 'section_mark_info',
            timestamps: false
        });
    SectionMarkInfo.belongsTo(SectionMark, { as: 'sectionMark', foreignKey: 'section_mark_id' });
    SectionMarkInfo.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return SectionMarkInfo;
};
