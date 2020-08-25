module.exports = (sequelize, DataTypes) =>
    sequelize.define('ExtraCollectionPayment', {
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
        payment_boucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        head_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sub_head_id: {
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
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: true
        },
        edited_Count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        collected_by:{
            type: DataTypes.STRING,
            allowNull: true
        },
        updated_details:{
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        tableName: 'extra_collection_payment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });
