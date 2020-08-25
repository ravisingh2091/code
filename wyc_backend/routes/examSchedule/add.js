const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const ScheduleSection = db.models.ScheduleSection;
const ScheduleTerm = db.models.ScheduleTerm;
const ScheduleExam = db.models.ScheduleExam;
const ScheduleTest = db.models.ScheduleTest;

function addExamSchedule(req, res, next) {
    const data = req.body;
    async.eachSeries(data.sectionInfo, (element, firstCallBack) => {
        ScheduleSection.findOrCreate({
            defaults: {
                pattern_id: data.pattern_id,
                session_id: data.session_id,
                section_id: element.section_id
            }, where: {
                pattern_id: data.pattern_id,
                session_id: data.session_id,
                section_id: element.section_id
            }
        }).then((scheduleSectionInfo) => {
            ScheduleTerm.findOrCreate({
                defaults: {
                    schedule_section_id: scheduleSectionInfo[0].id,
                    pattern_term_id: data.pattern_term_id,
                    session_id: data.session_id,
                    section_id: element.section_id
                }, where: {
                    pattern_term_id: data.pattern_term_id,
                    session_id: data.session_id,
                    section_id: element.section_id
                }
            }).then((scheduleTermInfo) => {
                ScheduleExam.findOrCreate({
                    defaults: {
                        schedule_term_id: scheduleTermInfo[0].id,
                        pattern_exam_id: data.pattern_exam_id,
                        session_id: data.session_id,
                        section_id: element.section_id
                    },
                    where: {
                        pattern_exam_id: data.pattern_exam_id,
                        session_id: data.session_id,
                        section_id: element.section_id
                    }
                }).then((scheduleExamInfo) => {
                    ScheduleTest.findOrCreate({
                        defaults: {
                            schedule_exam_id: scheduleExamInfo[0].id,
                            pattern_test_id: data.pattern_test_id,
                            session_id: data.session_id,
                            section_id: element.section_id,
                            start_date: utils.formatDate(element.start_date),
                            end_date: utils.formatDate(element.end_date),
                            publish_date: utils.formatDate(element.publish_date)
                        },
                        where: {
                            pattern_test_id: data.pattern_test_id,
                            session_id: data.session_id,
                            section_id: element.section_id
                        }
                    }).then(() => {
                        firstCallBack();
                    });
                });
            });
        });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Exam scheduled successfully'
        });
    });
}

module.exports = addExamSchedule;
