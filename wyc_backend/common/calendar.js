'use strict';
const commonStudent = require('./student'),
    pushNotification = require('./pushNotification'),
    db = require('../database'),
    utils = require('../lib/utils'),
    Session = db.models.Session,
    Employee = db.models.Employee,
    EmployeeDevice = db.models.EmployeeDevice,
    Calendar = db.models.Calendar,
    CalendarClass = db.models.CalendarClass,
    CalendarHoliday = db.models.CalendarHoliday,
    Holiday = db.models.Holiday,
    WeekOff = db.models.WeekOff,
    calendarFunction = {

    /**
     * Get employee calendar_id
     */
    getEmployeeCalendar: (employee_id) => {
        return Employee.findOne({ attributes: ['id', 'calendar_id'], where: { id: employee_id } }).then((data) => {
            console.log(JSON.stringify(data));
            data = data.get();
            return data ? data.calendar_id : null;
        });
    },

    /**
     * Get class calendar id
     * @param classId
     * @returns {*}
     */
    getClassCalendar: (classId) => {
        return CalendarClass.findOne({
            include: [{
                attributes: [],
                model: Calendar,
                as: 'calendar',
                include: [{
                    attributes: [],
                    model: Session,
                    as: 'session',
                    where: {
                        status: 'Present'
                    }
                }]
            }],
            where: {
                class_id: classId
            }
        }).then((data) => {
            if (data) {
                return data.calendar_id;
            }
        });
    },

    /**
     * Get calendar classes
     * @param calendar_id
     * @returns {*}
     */
    getCalendarClass: (calendar_id) => {
        const whereCondition = {};
        if (Array.isArray(calendar_id)) {
            whereCondition.calendar_id = {
                $in: calendar_id
            };
        } else {
            whereCondition.calendar_id = calendar_id;
        }
        return CalendarClass.findAll({ where: whereCondition }).then((classList) => {
            return classList.map((classes) => { return classes.class_id; });
        });
    },

    /**
     * Get calendar week off's
     * @param calenderId
     * @returns {*}
     */
    getCalendarWeekOff: (calenderId) => {
        if (calenderId) {
            return WeekOff.findAll({
                where: {
                    calendar_id: calenderId
                },
                order: 'date'
            }).then((data) => {
                return {
                    status: true,
                    message: 'Weekoff listed successfully',
                    data: data
                };
            });
        }
        return {
            status: false,
            message: 'No Weekoff'
        };
    },

    /**
     * Get calendar holidays
     * @param calendarId
     * @returns {*}
     */
    getCalendarHoliday: (calendarId) => {
        return CalendarHoliday.findAll({
            include: [{
                required: true,
                attributes: ['name', 'start_date', 'end_date', 'no_of_days'],
                model: Holiday,
                as: 'holiday'
            }],
            where: {
                calendar_id: calendarId
            },
            order: 'holiday.start_date'
        }).then((data) => {
            return data;
        });
    },

    /**
     * Get class holidays
     * @param class_id
     * @returns {*}
     */
    getClassHoliday: (class_id) => {
        return calendarFunction.getClassCalendar(class_id).then((calendar_id) => {
            return calendarFunction.getCalendarHoliday(calendar_id).then((data) => {
                return data;
            });
        });
    },

    /**
     * Get class week off's
     * @param class_id
     * @returns {*}
     */
    getClassWeekOff: (class_id) => {
        return calendarFunction.getClassCalendar(class_id).then((calendar_id) => {
            return calendarFunction.getCalendarWeekOff(calendar_id).then((data) => {
                return data.data;
            });
        });
    },

    /**
     * Send push notification for parent and employee (add or remove holiday from calendar)
     * @param calendar_id
     * @param holiday_id
     * @param operation
     * @param assign_id
     * @returns {*}
     */
    sendAssignCalendarUpdate: (calendar_id, holiday_id, operation, assign_id = '') => {
        return Promise.all([
            calendarFunction.getCalendarClass(calendar_id),
            calendarFunction.getCalendarEmpDeviceTokens(calendar_id)
        ]).then(([classArray, empTokens]) => {
            if (classArray.length || empTokens.length) {
                return commonStudent.getClassStudent(classArray).then((studentList) => {
                    if (studentList.length || empTokens.length) {
                        const parentArray = studentList.map((student) => { return student.student.parent_id; });
                        return commonStudent.getParentDeviceTokens(parentArray).then((deviceList) => {
                            if (deviceList.length || empTokens.length) {
                                return Holiday.findById(holiday_id).then((holidayInfo) => {
                                    const deviceTokens = [];
                                    if (deviceList.length) {
                                        deviceList.forEach((row) => {
                                            deviceTokens.push(row.device_token);
                                        });
                                    }

                                    if (empTokens.length) {
                                        empTokens.forEach((row) => {
                                            deviceTokens.push(row.device_token);
                                        });
                                    }

                                    const title = 'Holiday';
                                    let msg = '';

                                    const dateInfo = holidayInfo.no_of_days === 1 ? utils.formatDate(holidayInfo.start_date, 'DD-MMM-YY') : utils.formatDate(holidayInfo.start_date, 'DD-MMM-YY') + ' to ' + utils.formatDate(holidayInfo.end_date, 'DD-MMM-YY');

                                    if (operation === 'ADD') {
                                        msg = `${dateInfo} \n ${holidayInfo.name} is new holiday added to your calendar.`;
                                    } else if (operation === 'DELETE') {
                                        msg = `${dateInfo} \n ${holidayInfo.name} is removed from your holiday list.`;
                                    } else {
                                        msg = `${dateInfo} \n ${holidayInfo.name} is updated.`;
                                    }

                                    const data = {
                                        holiday_id,
                                        calendar_id: Array.isArray(calendar_id) ? '' : calendar_id,
                                        operation,
                                        assign_id
                                    };

                                    pushNotification.pushMessage(deviceTokens, title, msg, '', data);
                                    return true;
                                });
                            } else {
                                return true;
                            }
                        });
                    } else {
                        return true;
                    }
                });
            } else {
                return true;
            }
        });
    },

    getCalendarEmpDeviceTokens: (calendar_id) => {
        return EmployeeDevice.findAll({
            attributes: ['device_token'],
            include: [{
                required: true,
                attributes: [],
                model: Employee,
                as: 'employee'
            }],
            where: {
                '$employee.calendar_id$': calendar_id,
                status: 1
            }
        }).then((data) => {
            return data;
        });
    },


    /**
     * Send push notification for parent when calendar holiday update
     * @param holiday_id
     * @returns {*}
     */
    sendHolidayUpdate: (holiday_id) => {
        return calendarFunction.getHolidayCalendar(holiday_id).then((calendarList) => {
            if (calendarList.length) {
                return calendarFunction.sendAssignCalendarUpdate(calendarList, holiday_id, 'UPDATE');
            } else {
                return true;
            }
        });
    },

    /**
     * Get calendar list for particular holiday
     * @param holiday_id
     * @returns {*}
     */
    getHolidayCalendar: (holiday_id) => {
        return CalendarHoliday.findAll({ where: { holiday_id } }).then((calendarList) => {
            return calendarList.map((calendar) => { return calendar.calendar_id; });
        });
    }
};

module.exports = calendarFunction;
