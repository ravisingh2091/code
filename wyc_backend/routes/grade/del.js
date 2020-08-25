const async = require('async');
const db = require('../../database');
const Grade = db.models.Grade;
function del(req, res, next) {
           Grade.destroy({ where: { branch_id: req.query.branch_id}}).then(() => {
               });
   res.json( {
                   status: true,
                   message: 'Grades Delete successfully \n added a new grading system'
           });
           }
module.exports = del;