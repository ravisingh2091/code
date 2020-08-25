module.exports = (sequelize, DataTypes) => {
    const ScheduleTest = require('./ScheduleTest')(sequelize, DataTypes);
    const Subject = require('./Subject')(sequelize, DataTypes);
    //const ScheduleSubTestInfo = require('./ScheduleSubTestInfo')(sequelize, DataTypes);


    const ScheduleTestInfo = sequelize.define('ScheduleTestInfo',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNUll: false,
                primaryKey: true,
                autoIncrement: true
            },
            schedule_test_id: {
                type: DataTypes.INTEGER,
                allowNUll: false
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNUll: false
            },
            no_of_sub_test:{
                type: DataTypes.INTEGER,
                allowNUll: false
            }
        }, {
            tableName: 'schedule_test_info',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    ScheduleTestInfo.belongsTo(ScheduleTest, { as: 'scheduleTest', foreignKey: 'schedule_test_id' });
    ScheduleTestInfo.belongsTo(Subject, { as: 'subject', foreignKey: 'subject_id' });
   //ScheduleSubTestInfo.belongsTo(ScheduleSubTestInfo, { as: 'ScheduleSubTestInfo', foreignKey: 'id' });
    return ScheduleTestInfo;ib
};
