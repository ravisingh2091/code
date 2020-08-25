const commonExam = require('../../common/exam');

function listTest(req, res, next) {
    const session_id = req.query.session_id;
    const section_id = req.query.section_id || null;
    const class_id = req.query.class_id || null;
    const status = req.query.status || null;
    const pattern_test_id = req.query.pattern_test_id || null;


    commonExam.getScheduleTestList(session_id, section_id, status, pattern_test_id, class_id).then((result) => {
        res.json({
            status: true,
            message: 'Scheduled test listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listTest;
