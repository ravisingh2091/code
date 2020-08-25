const commonExam = require('../../common/exam');

function listTermSection(req, res, next) {
    if (!req.query.session_id) {
        return res.json({
            status: false,
            message: 'Session id is required'
        });
    }
    if (!req.query.section_id) {
        return res.json({
            status: false,
            message: 'Section id is required'
        });
    }

    commonExam.getScheduleTermList(req.query.session_id, req.query.section_id, req.query.status).then((data) => {
        getFinal(data, (result) => {
            res.json({
                status: true,
                message: 'Section Schedule term listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listTermSection;

function getFinal(termList, callback) {
    const finalArray = [];
    termList.forEach(element => {
        finalArray.push({
            schedule_term_id: element.id,
            name: element.patternTerm.term.name,
            status: element.status
        });
    });
    callback(finalArray);
}
