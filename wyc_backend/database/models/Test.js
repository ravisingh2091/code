module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const Test = sequelize.define('Test',
        {
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
            tableName: 'test',
            timeStamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    Test.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return Test;
};
