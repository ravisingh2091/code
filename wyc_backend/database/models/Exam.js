module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);

    const Exam = sequelize.define('Exam',
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
            tableName: 'exam',
            timeStamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
        
    Exam.belongsTo(Branch, {as: 'branch', foreignKey:'branch_id'});
    return Exam;
};
