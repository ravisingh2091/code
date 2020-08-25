const commonExam = require('../../common/exam');

function listExam(req, res, next) {
    if (!req.query.session_id) {
        return res.json({
            status: false,
            message: 'Session id is required'
        });
    }

    commonExam.getScheduleExamList(req.query.session_id, req.query.section_id, req.query.status).then((result) => {
        res.json({
            status: true,
            message: 'Exam listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listExam;
