module.exports = (sequelize, DataTypes) => {
    const FeeLate = sequelize.define('FeeLate',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            student_section_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            for_which_invoice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            added_invoice: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: true
            }
        }, {
            tableName: 'fee_late',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );
    return FeeLate;
};
