module.exports = (sequelize, DataTypes) => {
    const TermMark = require('./TermMark')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);
    const TermMarkInfo = sequelize.define('TermMarkInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            term_mark_id: {
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
            grace_mark: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false
            },
            total_mark: {
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
            tableName: 'term_mark_info',
            timestamps: false
        });
    TermMarkInfo.belongsTo(TermMark, { as: 'termMark', foreignKey: 'term_mark_id' });
    TermMarkInfo.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
    return TermMarkInfo;
};
