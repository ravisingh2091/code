const commonExam = require('../../common/exam');

function list(req, res, next) {
    const schedule_test_id = req.query.schedule_test_id;
    const stu_sec_id = req.query.stu_sec_id ? req.query.stu_sec_id : '';
    commonExam.getScheduleTestInfo(schedule_test_id).then((testInfo) => {
        return commonExam.listTestMarkInfo(schedule_test_id, stu_sec_id).then((testMarks) => {
            return getFinalResult(testMarks, (result) => {
                res.json({
                    status: true,
                    message: 'Test mark listed successfully',
                    data: {
                        result,
                        testInfo
                    }
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;

function getFinalResult(testMarks, callback) {
    const finalArray = [];
    testMarks.forEach(element => {
        if (!finalArray.some((check) => {
            return check.test_mark_id === element.testMark.id;
        })) {
            finalArray.push({
                test_mark_id: element.testMark.id,
                stu_sec_id: element.testMark.studentSection.id,
                stu_roll_no: element.testMark.studentSection.roll_no,
                first_name: element.testMark.studentSection.student.first_name,
                last_name: element.testMark.studentSection.student.last_name,
                admission_no: element.testMark.studentSection.student.admission_no,
                total: element.testMark.mark,
                status: element.testMark.status,
                subjectMarks: [{
                    test_mark_info_id: element.id,
                    subject_id: element.subject.id,
                    subject: element.subject.name,
                    mark: element.mark,
                    status: element.status
                }]
            });
        } else {
            const targetRow = finalArray.filter((check) => {
                return check.test_mark_id === element.testMark.id;
            })[0];
            targetRow.subjectMarks.push({
                test_mark_info_id: element.id,
                subject_id: element.subject.id,
                subject: element.subject.name,
                mark: element.mark,
                status: element.status
            });
        }
    });
    return callback(finalArray);
}
