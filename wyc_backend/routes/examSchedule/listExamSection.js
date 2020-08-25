const commonExam = require('../../common/exam');

function listExamSection(req, res, next) {
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

    commonExam.getScheduleExamList(req.query.session_id, req.query.section_id, req.query.status).then((data) => {
        getFinal(data, (result) => {
            res.json({
                status: true,
                message: 'Section Schedule Exam listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listExamSection;

function getFinal(termList, callback) {
    const finalArray = [];
    termList.forEach(element => {
        if (!finalArray.some((row) => { return row.schedule_term_id === element.schedule_term_id; })) {
            finalArray.push({
                schedule_term_id: element.schedule_term_id,
                term_name: element.patternExam.patternTerm.term.name,
                exams: [{
                    schedule_exam_id: element.id,
                    exam_name: element.patternExam.exam.name,
                    no_of_test: element.patternExam.no_of_test,
                    test_consider: element.patternExam.test_consider,
                    max_mark: element.patternExam.max_mark,
                    pass_percentage: element.patternExam.pass_percentage,
                    weightage: element.patternExam.weightage,
                    status: element.status
                }]
            });
        } else {
            const targetRow = finalArray.filter((row) => { return row.schedule_term_id === element.schedule_term_id; })[0];
            targetRow.exams.push({
                schedule_exam_id: element.id,
                exam_name: element.patternExam.exam.name,
                no_of_test: element.patternExam.no_of_test,
                test_consider: element.patternExam.test_consider,
                max_mark: element.patternExam.max_mark,
                pass_percentage: element.patternExam.pass_percentage,
                weightage: element.patternExam.weightage,
                status: element.status
            });
        }
    });
    return callback(finalArray);
}
