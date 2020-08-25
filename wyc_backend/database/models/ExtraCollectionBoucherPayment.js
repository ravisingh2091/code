module.exports = (sequelize, DataTypes) =>
    sequelize.define('ExtraCollectionBoucherPayment', {
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
        admission_no: {
            type: DataTypes.STRING,
            allowNull: true
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
        class:{
            type: DataTypes.STRING,
            allowNull: true
        },
        section:{
            type: DataTypes.STRING,
            allowNull: true
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true
        },
        father_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile_number:{
            type: DataTypes.STRING,
            allowNull: true
        },
        address:{
            type: DataTypes.STRING,
            allowNull: true
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
        collected_by:{
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        tableName: 'extra_collection_boucher_payment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });
