const commonExam = require('../../common/exam');

function listTerm(req, res, next) {
    if (!req.query.session_id) {
        return res.json({
            status: false,
            message: 'Session id is required'
        });
    }
    
    commonExam.getScheduleTermList(req.query.session_id, req.query.section_id, req.query.status).then((result) => {
        res.json({
            status: true,
            message: 'Schedule Terms listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listTerm;
