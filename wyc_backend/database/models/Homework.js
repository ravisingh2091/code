module.exports = (sequelize, DataTypes) => {
    const Subject = require('./Subject')(sequelize, DataTypes);
    const Employee = require('./Employee')(sequelize, DataTypes);
    const Session = require('./Session')(sequelize, DataTypes);
    const Section = require('./Section')(sequelize, DataTypes);

    const Homework = sequelize.define('Homework', {
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
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        images: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'homework',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Homework.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    Homework.belongsTo(Subject, {as: 'subject', foreignKey: 'subject_id'});
    Homework.belongsTo(Employee, {as: 'employee', foreignKey: 'created_by'});
    Homework.belongsTo(Section, {as: 'section', foreignKey: 'section_id'});
    return Homework;
};
