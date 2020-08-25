const commonExam = require('../../common/exam');

function getSectionPattern(req, res, next) {
    if (req.query.session_id && req.query.section_id) {
        commonExam.getSectionPattern(req.query.session_id, req.query.section_id).then((patternInfo) => {
            if (patternInfo) {
                return commonExam.getSessionPattern(null, patternInfo.pattern_id).then((result) => {
                  result[0].non_exam_point = patternInfo.non_exam_point;
                    res.json({
                        status: true,
                        message: 'Section pattern info get successfully',
                        data:result[0]
                    });
                });
            } else {
                return res.json({
                    status: false,
                    message: 'Pattern not assign'
                });
            }
        }).catch((err) => {
            next(err);
        });
    } else if (req.query.pattern_id) {
        commonExam.getSessionPattern(null, req.query.pattern_id).then((result) => {
            res.json({
                status: true,
                message: 'Pattern info get successfully',
                data: result[0]
            });
        });
    } else {
        res.json({
            status: false,
            message: 'session and section info OR pattern info required'
        });
    }
}

module.exports = getSectionPattern;
