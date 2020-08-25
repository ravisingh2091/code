module.exports = (sequelize, DataTypes) => {
      //  const Session = require('./Session')(sequelize, DataTypes);
    //const Employee = require('./Employee')(sequelize, DataTypes);
   //const Branch = require('./Branch')(sequelize, DataTypes);
    

    const Certificate = sequelize.define('Certificate', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
         branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
       emp_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        joining_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
            leaving_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        from_class: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_class: {
             type: DataTypes.STRING,
            allowNull: true
        },
        subjects_taken: {
             type: DataTypes.STRING,
            allowNull: true
        }
        
        
    }, {
        tableName: 'certificate',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    });

   // Certificate.belongsTo(Session, {as: 'session', foreignKey: 'session_id'});
    //Certificate.belongsTo(Branch, {as: 'branch', foreignKey: 'branch_id'});
    //Certificate.belongsTo(Employee, {as: 'employee', foreignKey: 'employee_id'});
    

     return Certificate;
    
};
