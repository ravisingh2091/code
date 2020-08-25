const commonExam = require('../../common/exam');

function get(req, res, next) {
    commonExam.getTermMarkInfo(req.query.term_mark_id).then((result) => {
        res.json({
            status: true,
            message: 'Term Mark info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
