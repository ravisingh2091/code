module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);

    const Class = sequelize.define('Class', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue:true
        },
        sort: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'class',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false
    });

    Class.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
    return Class;
};
