module.exports = (sequelize, DataTypes) => {
    const Class = require('./Class')(sequelize, DataTypes);

    const Section = sequelize.define('Section', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: true
        }
    }, {
        tableName: 'section',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

    Section.belongsTo(Class, {as: 'class', foreignKey: 'class_id'});
    return Section;
};
