const commonExam = require('../../common/exam');

function list(req, res, next) {
    const schedule_term_id = req.query.schedule_term_id;
    const stu_sec_id = req.query.stu_sec_id ? req.query.stu_sec_id : '';
    commonExam.getScheduleTermInfo(schedule_term_id).then((termInfo) => {
        return commonExam.listTermMarkInfo(schedule_term_id, stu_sec_id).then((termMarks) => {
            return getFinalResult(termMarks, (result) => {
                res.json({
                    status: true,
                    message: 'Term mark listed successfully',
                    data: {
                        result,
                        termInfo
                    }
                });
            });
        }).catch((err) => {
            next(err);
        });
    });
}

module.exports = list;

function getFinalResult(testMarks, callback) {
    const finalArray = [];
    testMarks.forEach(element => {
        if (!finalArray.some((check) => {
            return check.term_mark_id === element.termMark.id;
        })) {
            finalArray.push({
                term_mark_id: element.termMark.id,
                stu_sec_id: element.termMark.studentSection.id,
                stu_roll_no: element.termMark.studentSection.roll_no,
                first_name: element.termMark.studentSection.student.first_name,
                last_name: element.termMark.studentSection.student.last_name,
                admission_no: element.termMark.studentSection.student.admission_no,
                total: element.termMark.mark,
                rank: element.termMark.rank,
                status: element.termMark.status,
                subjectMarks: [{
                    term_mark_info_id: element.id,
                    subject_id: element.subject.id,
                    subject: element.subject.name,
                    mark: element.mark,
                    grace_mark: element.grace_mark,
                    total_mark: element.total_mark,
                    grade: element.grade,
                    status: element.status
                }]
            });
        } else {
            const targetRow = finalArray.filter((check) => {
                return check.term_mark_id === element.termMark.id;
            })[0];
            targetRow.subjectMarks.push({
                term_mark_info_id: element.id,
                subject_id: element.subject.id,
                subject: element.subject.name,
                mark: element.mark,
                grace_mark: element.grace_mark,
                total_mark: element.total_mark,
                grade: element.grade,
                status: element.status
            });
        }
    });
    return callback(finalArray);
}

