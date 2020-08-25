const async = require('async');
const pushNotification = require('../../common/pushNotification');
const utils = require('../../lib/utils');
const db = require('../../database');
const Holiday = db.models.Holiday;
const CalendarHoliday = db.models.CalendarHoliday;
const CalendarClass = db.models.CalendarClass;
const StudentSection = db.models.StudentSection;
const Section = db.models.Section;
const Student = db.models.Student;
const ParentDevice = db.models.ParentDevice;

function holidayNotification(req, res, next) {
    CalendarHoliday.findAll({
        attributes: ['id', 'calendar_id'],
        include: [{
            required: true,
            models: Holiday,
            as: 'holiday'
        }],
        where: {
            '$holiday.start_date$': utils.addDays(new Date(), 1)
        }
    }).then((calendarList) => {
        if (calendarList.length) {
            async.eachSeries(calendarList, (calendar, callback) => {
                CalendarClass.findAll({
                    attributes: ['class_id'],
                    where: {
                        calendar_id: calendar.id
                    }
                }).then((classList) => {
                    if (classList.length) {
                        const classArray = classList.map((classes) => { return classes.class_id; });
                        StudentSection.findAll({
                            attributes: ['id'],
                            include: [{
                                required: true,
                                attributes: [],
                                model: Section,
                                as: 'section'
                            }, {
                                required: true,
                                attributes: ['parent_id'],
                                model: Student,
                                as: 'student'
                            }],
                            where: {
                                '$section.class_id': {
                                    $in: classArray
                                }
                            }
                        }).then((studentList) => {
                            if (studentList.length) {
                                const parentArray = studentList.map((student) => { return student.student.parent_id; });
                                ParentDevice.findAll({
                                    attributes: ['device_token'],
                                    where: {
                                        $in: {
                                            parent_id: parentArray
                                        }
                                    }
                                }).then((deviceList) => {
                                    if (deviceList) {
                                        pushNotification.pushMessage();
                                    } else {
                                        callback();
                                    }
                                });
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                });
            });
        }
    });
}

module.exports = holidayNotification;
