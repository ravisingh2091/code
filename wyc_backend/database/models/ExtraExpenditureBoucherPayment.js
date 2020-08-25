module.exports = (sequelize, DataTypes) =>
    sequelize.define('ExtraExpenditureBoucherPayment', {
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
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        boucher_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        discount:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        final_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        edit_count:{
            type: DataTypes.INTEGER,
            //allowNull: true
        },
        edit_discription:{
            type: DataTypes.STRING,
            allowNull: true
        },
        given_by:{
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        tableName: 'extra_expenditure_boucher_payment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });
