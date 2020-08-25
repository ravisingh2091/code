module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TimeTable',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            timetable_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            summer_start_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            summer_end_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            summer_duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            winter_start_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            winter_end_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            winter_duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('Period', 'Break'),
                allowNull: false
            }
        }, {
            tableName: 'timings',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );
};
