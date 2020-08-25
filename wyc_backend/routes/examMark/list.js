const commonExam = require('../../common/exam');

function list(req, res, next) {
    const schedule_exam_id = req.query.schedule_exam_id;
    const stu_sec_id = req.query.stu_sec_id ? req.query.stu_sec_id : '';
    commonExam.getScheduleExamInfo(schedule_exam_id).then((examInfo) => {
        return commonExam.listExamMarkInfo(schedule_exam_id, stu_sec_id).then((examMarks) => {
            return getFinalResult(examMarks, (result) => {
                res.json({
                    status: true,
                    message: 'Exam mark listed successfully',
                    data: {
                        result,
                        examInfo
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
            return check.exam_mark_id === element.examMark.id;
        })) {
            finalArray.push({
                exam_mark_id: element.examMark.id,
                stu_sec_id: element.examMark.studentSection.id,
                stu_roll_no: element.examMark.studentSection.roll_no,
                first_name: element.examMark.studentSection.student.first_name,
                last_name: element.examMark.studentSection.student.last_name,
                admission_no: element.examMark.studentSection.student.admission_no,
                total: element.examMark.total_mark,
                rank: element.examMark.rank,
                status: element.examMark.status,
                subjectMarks: [{
                    exam_mark_info_id: element.id,
                    subject_id: element.subject.id,
                    subject: element.subject.name,
                    mark: element.mark,
                    mark_type: element.mark_type,
                    status: element.status
                }]
            });
        } else {
            const targetRow = finalArray.filter((check) => {
                return check.exam_mark_id === element.examMark.id;
            })[0];
            targetRow.subjectMarks.push({
                exam_mark_info_id: element.id,
                subject_id: element.subject.id,
                subject: element.subject.name,
                mark: element.mark,
                mark_type: element.mark_type,
                status: element.status
            });
        }
    });
    return callback(finalArray);
}
