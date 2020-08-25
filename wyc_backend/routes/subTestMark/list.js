const commonExam = require('../../common/exam');

function list(req, res, next) {
    const schedule_test_id = req.query.schedule_test_id;
    const stu_sec_id = req.query.stu_sec_id || '';
    const subject_id = req.query.subject_id || '';

    commonExam.getTestSubTestMark(schedule_test_id, stu_sec_id, subject_id).then((subTestMarks) => {
        getFinalResult(subTestMarks, (result) => {
            res.json({
                status: true,
                message: 'Schedule test sub test mark listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;

function getFinalResult(subTestMarks, callback) {
    const finalArray = [];
    subTestMarks.forEach(element => {
        if (!finalArray.some((row) => {
            return row.stu_sec_id === element.studentSection.id;
        })) {
            finalArray.push({
                stu_sec_id: element.studentSection.id,
                roll_no: element.studentSection.roll_no,
                admission_no: element.studentSection.student.admission_no,
                first_name: element.studentSection.student.first_name,
                last_name: element.studentSection.student.last_name,
                subjectMark: [{
                    subject_id: element.scheduleSubTestInfo.scheduleTestInfo.subject.id,
                    subject_name: element.scheduleSubTestInfo.scheduleTestInfo.subject.name,
                    subTestMark: [{
                        id: element.id,
                        sub_test_name: element.scheduleSubTestInfo.description,
                        max_mark: element.scheduleSubTestInfo.max_mark,
                        mark: element.mark,
                        status: element.status
                    }]
                }]
            });
        } else {
            const studentTarget = finalArray.filter((row) => {
                return row.stu_sec_id === element.studentSection.id;
            })[0];

            if (!studentTarget.subjectMark.some((subRow) => {
                return subRow.subject_id === element.scheduleSubTestInfo.scheduleTestInfo.subject.id;
            })) {
                studentTarget.subjectMark.push({
                    subject_id: element.scheduleSubTestInfo.scheduleTestInfo.subject.id,
                    subject_name: element.scheduleSubTestInfo.scheduleTestInfo.subject.name,
                    subTestMark: [{
                        id: element.id,
                        sub_test_name: element.scheduleSubTestInfo.description,
                        max_mark: element.scheduleSubTestInfo.max_mark,
                        mark: element.mark,
                        status: element.status
                    }]
                });
            } else {
                const subMarkTarget = studentTarget.subjectMark.filter((subRow) => {
                    return subRow.subject_id === element.scheduleSubTestInfo.scheduleTestInfo.subject.id;
                })[0];
                subMarkTarget.subTestMark.push({
                    id: element.id,
                    sub_test_name: element.scheduleSubTestInfo.description,
                    max_mark: element.scheduleSubTestInfo.max_mark,
                    mark: element.mark,
                    status: element.status
                });
            }
        }
    });

    return callback(finalArray);
}

