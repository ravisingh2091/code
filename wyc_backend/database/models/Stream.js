module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const Stream = sequelize.define('Stream', {
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
        tableName: 'stream',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Stream.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
    return Stream;
};
