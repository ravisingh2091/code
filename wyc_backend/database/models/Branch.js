module.exports = (sequelize, DataTypes) => {
    const School = require('./School')(sequelize, DataTypes);

    const Branch = sequelize.define('Branch',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            school_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            branch: {
                type: DataTypes.STRING,
                allowNull: false
            },
            principal_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            secondary_email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            primary_no: {
                type: DataTypes.STRING,
                allowNull: false
            },
            secondary_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            affiliation_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            season: {
                type: DataTypes.ENUM('Summer', 'Winter'),
                defaultValue: 'Summer'
            },
            summer_start_time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            winter_start_time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            summer_end_time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            winter_end_time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            website: {
                type: DataTypes.STRING,
                allowNull: true
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pincode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            latitude: {
                type: DataTypes.STRING,
                allowNull: true
            },
            longitude: {
                type: DataTypes.STRING,
                allowNull: true
            },

            start_admission_no: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            min_attendance: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            grace_mark_status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: '0'
            },
            max_grace_mark: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            max_grace_subject: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            rank_status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: '0'
            },
            auto_generate: {
                type: DataTypes.INTEGER,
                defaultValue: '1'
            },
            invoice_generation_day: {
                type: DataTypes.INTEGER,
                defaultValue: '1'
            },
            invoice_due_date_diff: {
                type: DataTypes.INTEGER,
                defaultValue: '15'
            },
            enable_late_fee: {
                type: DataTypes.INTEGER,
                defaultValue: '1'
            },
            late_fee_amt: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false,
                defaultValue: '0.00'
            },
            late_fee_min_amt: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false,
                defaultValue: '0.00'
            },
            recurring_late_duration: {
                type: DataTypes.INTEGER,
                defaultValue: '30'
            },
            transport_status: {
                type: DataTypes.ENUM('0', '1'),
                defaultValue: '0'
            },
            transport_enable_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            trans_invoice_generation_day: {
                type: DataTypes.INTEGER,
                defaultValue: '1'
            },
            trans_invoice_due_date_diff: {
                type: DataTypes.INTEGER,
                defaultValue: '15'
            },
            sender_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            remaining_msg: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: '0',
            },
            msg_session_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: '0'
            },
            msg_date_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: '0'
            },
            msg_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            account_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            account_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ifsc: {
                type: DataTypes.STRING,
                allowNull: true
            },
            account_info: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            merchant_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            merchant_key: {
                type: DataTypes.STRING,
                allowNull: true
            },
            marchant_salt: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_account_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_account_no: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_ifsc: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_account_info: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            trans_merchant_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_merchant_key: {
                type: DataTypes.STRING,
                allowNull: true
            },
            trans_marchant_salt: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Active', 'Deactive'),
                defaultValue: 'Active'
            },
        }, {
            tableName: 'branch',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        });

    Branch.belongsTo(School, { as: 'school', foreignKey: 'school_id' });
    return Branch;
};
