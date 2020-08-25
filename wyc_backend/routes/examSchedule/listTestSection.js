const commonExam = require('../../common/exam');

function listTestSchedule(req, res, next) {
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

    commonExam.getScheduleTestList(req.query.session_id, req.query.section_id, req.query.status).then((data) => {
        getFinal(data, (result) => {
            res.json({
                status: true,
                message: 'Section schedule test listed succefully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listTestSchedule;

function getFinal(testList, callback) {
    const finalArray = [];

    testList.forEach((element) => {
        if (!finalArray.some((rowTerm) => { return rowTerm.schedule_term_id === element.scheduleExam.schedule_term_id; })) {
            finalArray.push({
                schedule_term_id: element.scheduleExam.schedule_term_id,
                term_name: element.patternTest.patternExam.patternTerm.term.name,
                exams: [{
                    schedule_exam_id: element.scheduleExam.id,
                    pattern_exam_name: element.patternTest.patternExam.exam.name,
                    max_mark: element.patternTest.patternExam.max_mark,
                    weightage: element.patternTest.patternExam.weightage,
                    pass_percentage: element.patternTest.patternExam.pass_percentage,
                    tests: [{
                        schedule_test_id: element.id,
                        pattern_test_id: element.patternTest.id,
                        max_mark: element.patternTest.max_mark,
                        pass_percentage: element.patternTest.pass_percentage,
                        test_name: element.patternTest.test.name,
                        status: element.status
                    }]
                }]
            });
        } else {
            const targetTerm = finalArray.filter((rowTerm) => { return rowTerm.schedule_term_id === element.scheduleExam.schedule_term_id; })[0];
            if (!targetTerm.exams.some((rowExam) => { return rowExam.schedule_exam_id === element.scheduleExam.id; })) {
                targetTerm.exams.push({
                    schedule_exam_id: element.scheduleExam.id,
                    pattern_exam_name: element.patternTest.patternExam.exam.name,
                    max_mark: element.patternTest.patternExam.max_mark,
                    weightage: element.patternTest.patternExam.weightage,
                    pass_percentage: element.patternTest.patternExam.pass_percentage,
                    tests: [{
                        schedule_test_id: element.id,
                        pattern_test_id: element.patternTest.id,
                        max_mark: element.patternTest.max_mark,
                        pass_percentage: element.patternTest.pass_percentage,
                        test_name: element.patternTest.test.name,
                        status: element.status
                    }]
                });
            } else {
                const targetTest = targetTerm.exams.filter((rowExam) => { return rowExam.schedule_exam_id === element.scheduleExam.id; })[0];
                targetTest.tests.push({
                    schedule_test_id: element.id,
                    pattern_test_id: element.patternTest.id,
                    max_mark: element.patternTest.max_mark,
                    pass_percentage: element.patternTest.pass_percentage,
                    test_name: element.patternTest.test.name,
                    status: element.status
                });
            }
        }
    });
    callback(finalArray);
}
