const commonExam = require('../../common/exam');

function list(req, res, next) {
    const schedule_section_id = req.query.schedule_section_id;
    const stu_sec_id = req.query.stu_sec_id ? req.query.stu_sec_id : '';
    commonExam.getScheduleSectionInfo(schedule_section_id).then((sectionInfo) => {
        return commonExam.listSectionMarkInfo(schedule_section_id, stu_sec_id).then((sectionMarks) => {
            return getFinalResult(sectionMarks, (result) => {
                res.json({
                    status: true,
                    message: 'Section mark listed successfully',
                    data: {
                        result,
                        sectionInfo
                    }
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;

function getFinalResult(sectionMarks, callback) {
    const finalArray = [];
    sectionMarks.forEach(element => {
        if (!finalArray.some((check) => {
            return check.section_mark_id === element.sectionMark.id;
        })) {
            finalArray.push({
                section_mark_id: element.sectionMark.id,
                stu_sec_id: element.sectionMark.studentSection.id,
                stu_roll_no: element.sectionMark.studentSection.roll_no,
                first_name: element.sectionMark.studentSection.student.first_name,
                last_name: element.sectionMark.studentSection.student.last_name,
                admission_no: element.sectionMark.studentSection.student.admission_no,
                total: element.sectionMark.mark,
                rank: element.sectionMark.rank,
                status: element.sectionMark.status,
                subjectMarks: [{
                    section_mark_info_id: element.id,
                    subject_id: element.subject.id,
                    subject: element.subject.name,
                    mark: element.mark,
                    grade: element.grade,
                    status: element.status
                }]
            });
        } else {
            const targetRow = finalArray.filter((check) => {
                return check.section_mark_id === element.sectionMark.id;
            })[0];
            targetRow.subjectMarks.push({
                section_mark_info_id: element.id,
                subject_id: element.subject.id,
                subject: element.subject.name,
                mark: element.mark,
                grade: element.grade,
                status: element.status
            });
        }
    });
    return callback(finalArray);
}
