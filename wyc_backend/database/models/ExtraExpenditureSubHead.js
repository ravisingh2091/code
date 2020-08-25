module.exports = (sequelize, DataTypes) =>
    sequelize.define('ExtraExpenditureSubHead', {
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
        branch_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        head_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // amount: {
        //     type: DataTypes.DECIMAL,
        //     allowNull: false
        // },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: true
        }
    }, {
        tableName: 'extra_expenditure_sub_head',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });
