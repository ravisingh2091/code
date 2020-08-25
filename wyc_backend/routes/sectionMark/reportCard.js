const db = require('../../database'),
    ExamMark = db.models.ExamMark,
    ExamMarkInfo = db.models.ExamMarkInfo,
    TermMark = db.models.TermMark,
    TermMarkInfo = db.models.TermMarkInfo,
    SectionMark = db.models.SectionMark,
    SectionMarkInfo = db.models.SectionMarkInfo,
    ScheduleSection = db.models.ScheduleSection,
    ScheduleTerm = db.models.ScheduleTerm,
    ScheduleExam = db.models.ScheduleExam;
    SubTestMark = db.models.SubTestMark;

function reportCard(req, res, next) {
    const stu_sec_id = req.query.stu_sec_id;
    if (!stu_sec_id) {
        return res.json({
            status: false,
            message: 'Student section required'
        });
    }
    Promise.all([
        ExamMark.findAll({
            include: [{
                required: true,
                attributes: ['id', 'pattern_exam_id', 'schedule_term_id'],
                model: ScheduleExam,
                as: 'scheduleExam',
            }],
            where: {
                stu_sec_id
            }
        }),
        ExamMarkInfo.findAll({
            include: [{
                required: true,
                attributes: ['id'],
                model: ExamMark,
                as: 'examMark',
                include: [{
                    required: true,
                    attributes: ['id', 'pattern_exam_id', 'schedule_term_id'],
                    model: ScheduleExam,
                    as: 'scheduleExam'
                }]
            }],
            where: {
                '$examMark.stu_sec_id$': stu_sec_id
            }
        }),
        TermMark.findAll({
            include: [{
                required: true,
                attributes: ['id', 'pattern_term_id'],
                model: ScheduleTerm,
                as: 'scheduleTerm'
            }],
            where: {
                stu_sec_id
            }
        }),
        TermMarkInfo.findAll({
            include: [{
                required: true,
                attributes: ['id'],
                model: TermMark,
                as: 'termMark',
                include: [{
                    required: true,
                    attributes: ['id', 'pattern_term_id'],
                    model: ScheduleTerm,
                    as: 'scheduleTerm',
                }]
            }],
            where: {
                '$termMark.stu_sec_id$': stu_sec_id
            }
        }),
        SectionMark.findAll({
            include: [{
                required: true,
                attributes: ['id', 'pattern_id'],
                model: ScheduleSection,
                as: 'scheduleSection'
            }],
            where: {
                stu_sec_id
            }
        }),
        SectionMarkInfo.findAll({
            include: [{
                required: true,
                attributes: ['id'],
                model: SectionMark,
                as: 'sectionMark',
                include: [{
                    required: true,
                    attributes: ['id', 'pattern_id'],
                    model: ScheduleSection,
                    as: 'scheduleSection'
                },
                 {
                    required: true,
                    attributes: ['id', 'status'],
                    model: SubTestMark,
                    as: 'sub_test_mark'
                }
                ],
            }],
            where: {
                '$sectionMark.stu_sec_id$': stu_sec_id
            }
        })
    ]).then(([examMark, examMarkInfo, termMark, termMarkInfo, sectionMark, sectionMarkInfo]) => {
        res.json({
            status: true,
            message: 'report card data listed successfully',
            data: {
                examMark,
                examMarkInfo,
                termMark,
                termMarkInfo,
                sectionMark,
                sectionMarkInfo
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = reportCard;
