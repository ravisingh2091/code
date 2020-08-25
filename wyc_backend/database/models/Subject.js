module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);

    const Subject = sequelize.define('Subject', {
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
        }
    }, {
        tableName: 'subject',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false
    });

    Subject.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
     //Subject.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
    return Subject;
};
