const utils = require('../../lib/utils');
const commonAttendance = require('../../common/attendance');
const commonStudent = require('../../common/student');
const commonSchool = require('../../common/school');
const commonCalendar = require('../../common/calendar');

function sectionReport(req, res, next) {
    const session_id = req.query.session_id;
    const class_id = req.query.class_id;
    const section_id = req.query.section_id;
    commonSchool.getBranchInfo(req.query.branch_id).then((branchInfo) => {
        return commonSchool.getSectionInfo(session_id, section_id).then((sectionInfo) => {
            return commonStudent.getSectionStudent(session_id, section_id).then((studentInfo) => {
                return commonSchool.getSessionList(session_id, 'Days').then((dayList) => {
                    return commonAttendance.getSectionWorkingDays(session_id, section_id).then((workingDays) => {
                        return commonCalendar.getClassWeekOff(class_id).then((weekOffList) => {
                            return commonCalendar.getClassHoliday(class_id).then((holidayList) => {
                                return getFullReport(dayList, workingDays, holidayList, weekOffList, (workingdaysInfo) => {
                                    return commonAttendance.sectionAttendance(section_id).then((attendanceList) => {
                                        return getFinalResult(workingdaysInfo.result, studentInfo, attendanceList, holidayList, weekOffList, branchInfo.min_attendance, (result) => {
                                            res.json({
                                                status: true,
                                                message: 'Section attendance report get successfully',
                                                data: {
                                                    no_of_student: result.studentCount,
                                                    min_attendance: branchInfo.min_attendance,
                                                    avg_attendance: result.avg_attendance,
                                                    not_meet_min_attendance: result.not_meet_min_attendance,
                                                    workingDays: workingdaysInfo.workingCount,
                                                    notTakenDays: workingdaysInfo.notTakenCount,
                                                    stuInfo: result.myArray,
                                                    sectionInfo
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = sectionReport;

function getFullReport(data, workingDays, Holiday, weekOff, callback) {
    let workingCount = 0;
    let HolidayCount = 0;
    let weekOffCount = 0;
    let notTakenCount = 0;

    const result = [];

    data.forEach(element => {
        if (!result.some((row) => { return row.month === utils.formatDate(element, 'MMMM'); })) {
            result.push({
                month: utils.formatDate(element, 'MMMM'),
                totalWorkingDays: 0,
                monthWorkingDays: 0,
                monthNotTakenDays: 0,
                days: [element]
            });
        } else {
            const targetRow = result.filter((row) => {
                return row.month === utils.formatDate(element, 'MMMM');
            })[0];
            targetRow.days.push(element);
        }

        if (workingDays.some((row) => { return element === utils.formatDate(row.date); })) {
            if (result.some((row) => { return row.month === utils.formatDate(element, 'MMMM'); })) {
                const targetRow = result.filter((row) => {
                    return row.month === utils.formatDate(element, 'MMMM');
                })[0];
                targetRow.monthWorkingDays += 1;
                targetRow.totalWorkingDays += 1;
            }
            workingCount++;
        } else if (Holiday.some((row) => { return element >= utils.formatDate(row.holiday.start_date) && element <= utils.formatDate(row.holiday.end_date); })) {
            HolidayCount++;
        } else if (weekOff.some((row) => { return element === utils.formatDate(row.date); })) {
            weekOffCount++;
        } else if (utils.checkDay(element, 0)) {
            weekOffCount++;
        } else {
            if (result.some((row) => { return row.month === utils.formatDate(element, 'MMMM'); })) {
                const targetRow = result.filter((row) => {
                    return row.month === utils.formatDate(element, 'MMMM');
                })[0];
                targetRow.monthNotTakenDays += 1;
                targetRow.totalWorkingDays += 1;
            }
            notTakenCount++;
        }
    });

    return callback({ result, workingCount, HolidayCount, weekOffCount, notTakenCount });
}

function getFinalResult(workingDaysInfo, studentInfo, stuAttendance, holiday, weekOff, min_attendance, callback) {
    const myArray = [];
    studentInfo.forEach((element) => {
        const myObject = {};
        let TotalWorking = 0;
        let notTaken = 0;
        let presentDays = 0;

        const monthInfo = [];
        workingDaysInfo.forEach((monthElement) => {
            const monthObject = {};
            let monthTotalDays = 0;
            let monthWorkingDays = 0;
            let monthNotTakenDays = 0;
            let monthPresentDays = 0;

            monthElement.days.forEach((dayElement) => {
                if (stuAttendance.some((row) => { return utils.formatDate(row.date) === dayElement && row.student_section_id === element.id; })) {
                    const targetRow = stuAttendance.filter((row) => { return utils.formatDate(row.date) === dayElement && row.student_section_id === element.id; })[0];
                    monthTotalDays++;
                    monthWorkingDays++;
                    TotalWorking++;

                    if (targetRow.status !== 0) {
                        monthPresentDays++;
                        presentDays++;
                    }
                } else if (!holiday.some((row) => { return dayElement >= utils.formatDate(row.holiday.start_date) && dayElement <= utils.formatDate(row.holiday.end_date); }) &&
                    !weekOff.some((row) => { return dayElement === utils.formatDate(row.date); }) && !utils.checkDay(dayElement, 0)) {
                    if (utils.formatDate(element.student.admission_date) <= dayElement) {
                        monthNotTakenDays++;
                        monthTotalDays++;
                        TotalWorking++;
                        notTaken++;
                    }
                }
            });
            monthObject['month'] = monthElement.month;
            monthObject['monthTotalDays'] = monthTotalDays;
            monthObject['monthWorkingDays'] = monthWorkingDays;
            monthObject['monthNotTakenDays'] = monthNotTakenDays;
            monthObject['monthPresentDays'] = monthPresentDays;
            monthInfo.push(monthObject);
        });
        myObject['first_name'] = element.student.first_name;
        myObject['last_name'] = element.student.last_name;
        myObject['totalWorkingDays'] = TotalWorking;
        myObject['notTaken'] = notTaken;
        myObject['presentDays'] = presentDays;
        myObject['monthInfo'] = monthInfo;
        myArray.push(myObject);
    });

    let studentCount = 0;
    let not_meet_min_attendance = 0;
    let totalWorkingDays = 0;
    let totalPresentDays = 0;
    myArray.forEach((element) => {
        const totalPresent = element.notTaken + element.presentDays;
        studentCount++;
        totalWorkingDays = totalWorkingDays + element.totalWorkingDays;
        totalPresentDays = totalPresentDays + totalPresent;
        if (min_attendance >= totalPresent / element.notTaken + element.presentDays * 100) {
            not_meet_min_attendance++;
        }
    });
    const avg_attendance = totalPresentDays / totalWorkingDays * 100;
    return callback({ myArray, studentCount, not_meet_min_attendance, avg_attendance });
}
