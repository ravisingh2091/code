const db = require('../../database');
const ScheduleTest = db.models.ScheduleTest;

/**
 * Selected sections any test is progress
 * Selected sections any test alrady schedule 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateSectionTest(req, res, next) {
    const session_id = req.query.session_id;
    const pattern_test_id = req.query.pattern_test_id;
    const sections = req.query.sections;
    const sectionArray = sections.split(',');

    ScheduleTest.findAll({
        where: {
            status: 'Progress',
            pattern_test_id,
            session_id,
            section_id: {
                $in: sectionArray
            }
        }
    }).then((result) => {
        if (result.length > 0) {
            return res.json({
                status: false,
                message: 'Selected exam has already been scheduled for some of the selected sections'
            });
        }
        res.json({
            status: true,
            message: 'All section eligible for test schedule'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = validateSectionTest;
