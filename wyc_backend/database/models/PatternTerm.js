
module.exports = (sequelize, DataTypes) => {
    const Pattern = require('./Pattern')(sequelize, DataTypes);
    const Term = require('./Term')(sequelize, DataTypes);
    const PatternTerm = sequelize.define('PatternTerm',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pattern_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            term_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            no_of_exam: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pass_percentage: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'pattern_term',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    PatternTerm.belongsTo(Pattern, { as: 'pattern', foreignKey: 'pattern_id' });
    PatternTerm.belongsTo(Term, { as: 'term', foreignKey: 'term_id' });
    return PatternTerm;
};
