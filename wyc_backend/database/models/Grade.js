module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);
    const Grade = sequelize.define('Grade',
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
            from_mark: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            to_mark: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            grade: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'grade',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        
    Grade.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return Grade;
};
