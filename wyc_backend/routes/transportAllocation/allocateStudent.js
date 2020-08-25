const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const Student = db.models.Student;

function allocationStudent(req, res, next) {
    async.eachSeries(req.body, (student, callback) => {
        Student.update({
            route_stop_id: student.route_stop_id,
            route_vehicle_id: student.route_vehicle_id,
            slot: student.slot,
            transport_type: student.type,
            trans_enable_date: utils.formatDate(student.trans_enable_date)
        }, { where: { id: student.student_id } }).then(() => {
            callback();
        });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Students stop allocated successfully'
        });
    });
}

module.exports = allocationStudent;
