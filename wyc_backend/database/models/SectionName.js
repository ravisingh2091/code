module.exports = (sequelize, DataTypes) => {
    return sequelize.define('SectionName', {
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
    }, 
    {
        tableName: 'section_name',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
