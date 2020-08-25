module.exports = (sequelize, DataTypes) => {
    const NonExamMark = sequelize.define('nonExam',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            term_schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            stu_sec_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mark: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            tablename: 'non_exam_mark',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return NonExamMark;
};
