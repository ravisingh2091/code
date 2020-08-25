module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);
    const Employee = require('./Employee')(sequelize, DataTypes);
    const Board = require('./Board')(sequelize, DataTypes);
    const Stream = require('./Stream')(sequelize, DataTypes);

    const ClassTeacher = sequelize.define('ClassTeacher', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        session_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        section_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        board_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        stream_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        roll_no_flag: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        delegated_teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        delegated_from_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        delegated_to_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'class_teacher',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

    ClassTeacher.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    ClassTeacher.belongsTo(Section, {as: 'section', foreignKey: 'section_id'});
    ClassTeacher.belongsTo(Employee, {as: 'employee', foreignKey: 'teacher_id'});
    ClassTeacher.belongsTo(Board, {as: 'board', foreignKey: 'board_id'});
    ClassTeacher.belongsTo(Stream, {as: 'stream', foreignKey: 'stream_id'});
    ClassTeacher.belongsTo(Employee, {as: 'delegatedTeacher', foreignKey: 'delegated_teacher_id'});
    return ClassTeacher;
};
