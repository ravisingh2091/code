 const db = require('../../database');
//const async = require('async');
const Certificate = db.models.Certificate;
const Employee =db.models.Employee;

function add(req,res,next){
    const data = req.body;
    console.log(data)
    Certificate.findOrCreate({
                    defaults: {
                         branch_id:req.query.branch_id,
                         employee_id:data.employee_id,
                         emp_name:data.emp_name,
                         
                        joining_date:data.joining_date,
                        leaving_date:data.leaving_date,
                        from_class:data.from_class,
                        to_class:data.to_class,
                        subjects_taken:data.subjects_taken
                       },
                    where: {
                         branch_id:req.query.branch_id,
                         employee_id: data.employee_id
                        }
                }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Certificate created added successfully'
            });
        }
        return res.json({
            status: false,
            message: 'Certificate already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
