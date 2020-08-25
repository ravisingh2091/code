module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const Term = sequelize.define('Term',
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
            tableName: 'term',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    Term.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return Term;
};
