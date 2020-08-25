const commonExam = require('../../common/exam');

function getSessionPattern(req, res, next) {
    commonExam.getSessionPattern(req.query.session_id).then((result) => {
        res.json({
            status: true,
            message: 'Session pattern get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getSessionPattern;
