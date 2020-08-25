module.exports = (sequelize, DataTypes) => {
    const Timings = require('./Timings')(sequelize, DataTypes);
    const ClassSubject = require('./ClassSubject')(sequelize, DataTypes);
    const Periods = sequelize.define('Periods',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            class_subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            timings_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            day: {
                type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            tableName: 'periods',
            timestamps: false
        });
    Periods.belongsTo(Timings, { as: 'timings', foreignKey: 'timings_id' });
    Periods.belongsTo(ClassSubject, { as: 'classSubject', foreignKey: 'class_subject_id' });
    return Periods;
};
