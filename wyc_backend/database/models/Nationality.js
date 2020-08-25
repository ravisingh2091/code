module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Nationality',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'nationality',
            timestamps: false
        }
    );
};
