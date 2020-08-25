module.exports = (sequelize, DataTypes) => {
    const Branch = require('./Branch')(sequelize, DataTypes);

    const Session = sequelize.define('Session', {
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
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Present','Past','Future'),
            allowNull: false
        }
    }, {
        tableName: 'session',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

    Session.belongsTo(Branch, { as: 'branch', foreignKey: 'branch_id' });
    return Session;
};
