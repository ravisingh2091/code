module.exports = (sequelize, DataTypes) => {
    const OneToOne = sequelize.define('OneToOne', {
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
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('SMS', 'Notice'),
            defaultValue: true
        },
        recipient: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recipient_type: {
            type: DataTypes.ENUM('Employee', 'Parent'),
            defaultValue: true
        }
    }, {
        tableName: 'one_to_one',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return OneToOne;
};
