const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const SupplementarySchedule = db.models.SupplementarySchedule;

function add(req, res, next) {
    const data = req.body;

    const schedule_exam_id = data.schedule_exam_id;

    async.eachSeries(data.studentSchedule, (element, cb) => {
        SupplementarySchedule.findOrCreate({
            defaults: {
                student_section_id: element.student_section_id,
                schedule_exam_id,
                subject_id: element.subject_id,
                date: utils.formatDate(element.date),
                start_time: element.start_time,
                end_time: element.end_time
            },
            where: {
                student_section_id: element.student_section_id,
                subject_id: element.subject_id,
                schedule_exam_id,
            }
        }).then(() => cb());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Exam supplementry scheduled succssfully'
        });
    });
}

module.exports = add;
