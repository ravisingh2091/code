const async = require('async');
const db = require('../../database');
const ClassSubject = db.models.ClassSubject;
const ExamSection = db.models.ExamSection;
const ScheduleTest = db.models.ScheduleTest;

/**
 * Any test progress in the sections
 * pattern assign or not
 * pattern are same of sections
 * subjects are same of sections or not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

function patternSubjectValidate(req, res, next) {
    const session_id = req.query.session_id;
    const sections = req.query.sections;
    const sectionArray = sections.split(',');

    ScheduleTest.findOne({
        where: {
            session_id,
            section_id: {
                $in: sectionArray
            },
            status: 'Progress'
        }
    }).then((progressCheck) => {
        if (!progressCheck) {
            return ExamSection.findAll({
                attributes: ['id', 'section_id', 'pattern_id'],
                where: {
                    session_id,
                    section_id: {
                        $in: sectionArray
                    }
                }
            }).then((patternInfo) => {
                if (patternInfo.length === sectionArray.length) {
                    if (sectionArray.length > 1) {
                        const patternValidate = patternInfo.every((row) => row.pattern_id === patternInfo[0].pattern_id);
                        let subjectStatus = true;
                        const subjectArr = [];
                        if (patternValidate) {
                            return async.eachSeries(sectionArray, (section, callback) => {
                                ClassSubject.findAll({
                                    where: {
                                        section_id: section,
                                        exam_status: 1
                                    },
                                    order: 'subject_id'
                                }).then((subjectInfo) => {
                                    if (subjectStatus) {
                                        // console.log('*****************');
                                        // console.log('-----------------');
                                        // console.log(JSON.stringify(subjectInfo), 'subjectInfo');
                                        // console.log(subjectStatus, 'subjectStatus');
                                        // console.log(subjectArr, 'subjectArr');
                                        if (subjectInfo.length > 0) {
                                            if (subjectArr.length === 0) {
                                                // console.log(subjectArr.length, 'subjectArr.length IF &&&&&&&');
                                                subjectInfo.forEach(element => {
                                                    subjectArr.push(element.subject_id);
                                                });
                                                return callback();
                                            } else {
                                                const subjectArrList = subjectInfo.map(x => x.subject_id);
                                                // console.log(subjectArrList, 'subjectArrList AFTER ELES &&&&&&&');

                                                if (JSON.stringify(subjectArr) === JSON.stringify(subjectArrList)) {
                                                    return callback();
                                                } else {
                                                    subjectStatus = false;
                                                    return callback();
                                                }
                                            }
                                        } else {
                                            // console.log(subjectInfo.length, 'subjectInfo.length 0 so false');
                                            subjectStatus = false;
                                            return callback();
                                        }
                                    } else {
                                        // console.log('just call back');
                                        callback();
                                    }
                                });
                            }, (err) => {
                                if (err) {
                                    next(err);
                                }
                                if (subjectStatus) {
                                    return res.json({
                                        status: true,
                                        message: 'All the subjects are same for the selected sections'
                                    });
                                } else {
                                    return res.json({
                                        status: false,
                                        message: 'All the subjects are not same for the selected sections'
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                status: false,
                                message: 'All the patterns are not same for the selected sections'
                            });
                        }
                    } else {
                        return res.json({
                            status: true,
                            message: 'Only one section selected'
                        });
                    }
                } else {
                    return res.json({
                        status: false,
                        message: 'Pattern not assigned selected class'
                    });
                }
            }).catch((err) => {
                next(err);
            });
        } else {
            return res.json({
                status: false,
                message: `Some section's exam already progress`
            });
        }
    });
}

module.exports = patternSubjectValidate;
