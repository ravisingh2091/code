const commonExam = require('../../common/exam');


function classSectionPattern(req, res, next) {
    commonExam.getClassSectionPattern(req.query.session_id).then((result) => {
        res.json({
            status: true,
            message: 'Class section pattern get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = classSectionPattern;
