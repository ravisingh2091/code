const db = require('../../database');
const student = require('../../common/student');
const Periods = db.models.Periods;
const Timings = db.models.Timings;
const ClassSubject = db.models.ClassSubject;
const Subject = db.models.Subject;
const Class = db.models.Class;
const Section = db.models.Section;

function teacherTimetable(req, res, next) {
    const whereCondition = {};
    let type = '';
    if (req.query.teacher_id) {
        type = 'Admin';
        whereCondition['$classSubject.teacher_id$'] = req.query.teacher_id;
    } else {
        type = 'Teacher';
        whereCondition['$classSubject.teacher_id$'] = req.query.employee_id;
        whereCondition['day'] = req.query.day;
    }

    Periods.findAll({
        attributes: ['id', 'day', 'description'],
        include: [{
            required: true,
            attributes: ['id', 'summer_start_time', 'summer_end_time', 'winter_start_time', 'winter_end_time', 'type'],
            model: Timings,
            as: 'timings'
        }, {
            required: true,
            attributes: ['id'],
            model: ClassSubject,
            as: 'classSubject',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Subject,
                as: 'subject'
            }, {
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }]
            }]
        }],
        where: whereCondition,
        order: ['day', 'timings.summer_start_time']
    }).then((teacherTimetable) => {
        return student.getBranchInfo(req.query.branch_id).then((branchInfo) => {
            getFinalResult(teacherTimetable, branchInfo, type, (result) => {
                res.json({
                    status: true,
                    message: 'Teacher timetable get successfully',
                    data: result
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = teacherTimetable;


function getFinalResult(teacherTimetable, branchInfo, type, callback) {
    const season = branchInfo.season;
    const result = [];

    if (type === 'Teacher') {
        teacherTimetable.forEach(element => {
            result.push({
                id: element.id,
                day: element.day,
                description: element.description,
                start_time: season === 'Summer' ? element.timings.summer_start_time : element.timings.winter_start_time,
                end_time: season === 'Summer' ? element.timings.summer_end_time : element.timings.winter_end_time,
                class: element.classSubject.section.class.name,
                section: element.classSubject.section.name,
                subject: element.classSubject.subject.name
            });
        });
        return callback(result);
    } else {
        teacherTimetable.forEach(element => {
            if (!result.some((row) => { return row.day === element.day; })) {
                result.push({
                    day: element.day,
                    periods: [{
                        start_time: season === 'Summer' ? element.timings.summer_start_time : element.timings.winter_start_time,
                        end_time: season === 'Summer' ? element.timings.summer_end_time : element.timings.winter_end_time,
                        class: element.classSubject.section.class.name,
                        section: element.classSubject.section.name,
                        subject: element.classSubject.subject.name,
                        description: element.description
                    }]
                });
            } else {
                const targetRow = result.filter((row) => { return row.day === element.day; })[0];
                targetRow.periods.push({
                    start_time: season === 'Summer' ? element.timings.summer_start_time : element.timings.winter_start_time,
                    end_time: season === 'Summer' ? element.timings.summer_end_time : element.timings.winter_end_time,
                    class: element.classSubject.section.class.name,
                    section: element.classSubject.section.name,
                    subject: element.classSubject.subject.name,
                    description: element.description
                });
            }
        });
        return callback({
            start_time: season === 'Summer' ? branchInfo.summer_start_time : branchInfo.winter_start_time,
            end_time: season === 'Summer' ? branchInfo.summer_end_time : branchInfo.winter_end_time,
            timetableInfo: result
        });
    }
}
