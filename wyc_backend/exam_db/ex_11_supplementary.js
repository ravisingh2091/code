module.exports = (sequelize, DataTypes) => {
    const Supplementary = sequelize.define('Supplementary',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            test_schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            stu_sec_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            date: {
                type: DataTypes.INTEGER,
                allowNUll: false
            },
            start_time: {
                type: DataTypes.INTEGER,
                allowNUll: false
            },
            end_time: {
                type: DataTypes.INTEGER,
                allowNUll: false
            }
        }, {
            tableName: 'supplementary',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return Supplementary;
};
