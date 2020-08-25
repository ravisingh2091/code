const async = require('async');
const db = require('../../database');
const ExamSection = db.models.ExamSection;

function add(req, res, next) {
    async.eachSeries(req.body.examSection, (assign, callback) => {
        ExamSection.findOrCreate({
            defaults: {
                session_id: req.body.session_id,
                section_id: assign.section_id,
                pattern_id: assign.pattern_id,
                non_exam_point: assign.non_exam_point
            },
            where: {
                session_id: req.body.session_id,
                section_id: assign.section_id
            }
        }).then(() => callback());
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json(201, {
            status: true,
            message: 'Exam pattern assign successfully'
        });
    });
}

module.exports = add;
