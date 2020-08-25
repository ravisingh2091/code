const student = require('../../common/student');
const db = require('../../database');
const Timings = db.models.Timings;
const Periods = db.models.Periods;
const ClassSubject = db.models.ClassSubject;
const Subject = db.models.Subject;
const Employee = db.models.Employee;

function getTimetable(req, res, next) {
    const whereCondition = {
        section_id: req.query.section_id
    };

    if (req.query.day) {
        whereCondition.day = req.query.day;
    }

    Periods.findAll({
        attributes: ['id', 'class_subject_id', 'timings_id', 'day', 'description'],
        include: [{
            required: true,
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
                attributes: ['id', 'first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            }]
        }],
        where: whereCondition,
        order: ['timings.summer_start_time', 'day']
    }).then((timetable) => {
        if (timetable.length > 0) {
            return student.getBranchInfo(req.query.branch_id).then((branchInfo) => {
                const season = branchInfo.season;

                const result = [];
                timetable.forEach((period) => {
                    result.push({
                        id: period.id,
                        class_subject_id: period.class_subject_id,
                        timings_id: period.timings_id,
                        day: period.day,
                        description: period.description,
                        timings: {
                            id: period.timings.id,
                            timetable_id: period.timings.timetable_id,
                            start_time: season === 'Summer' ? period.timings.summer_start_time : period.timings.winter_start_time,
                            end_time: season === 'Summer' ? period.timings.summer_end_time : period.timings.winter_end_time,
                            type: period.timings.type
                        },
                        subject: {
                            id: period.classSubject.subject.id,
                            name: period.classSubject.subject.name
                        },
                        employee: {
                            id: period.classSubject.employee ? period.classSubject.employee.id : null,
                            first_name: period.classSubject.employee ? period.classSubject.employee.first_name : null,
                            last_name: period.classSubject.employee ? period.classSubject.employee.last_name : null
                        }
                    });
                });
                res.json({
                    status: 'true',
                    message: 'Timetable Periods get successfully',
                    data: result
                });
            });
        } else {
            res.json({
                status: false,
                message: 'Timetable not created'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = getTimetable;
