module.exports = (sequelize, DataTypes) => {
    const Session = require('./Session')(sequelize, DataTypes);
    const Pattern = sequelize.define('Pattern',
        {
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
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            no_of_term: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            pass_percentage: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mark_type: {
                type: DataTypes.ENUM('Mark', 'Grade'),
                defaultValue: 'Mark',
            }
        }, {
            tableName: 'pattern',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });

    Pattern.belongsTo(Session, { as: 'session', foreignKey: 'session_id' });
    return Pattern;
};
