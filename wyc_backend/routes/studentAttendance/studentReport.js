const commonAttendance = require('../../common/attendance');
const commonSchool = require('../../common/school');
const commonStudent = require('../../common/student');

function studentReport(req, res, next) {
    const session_id = req.query.session_id;
    const section_id = req.query.section_id;
    const student_section_id = req.query.stu_sec_id;
    commonSchool.getBranchInfo(req.query.branch_id).then((branchInfo) => {
        return commonSchool.getSectionInfo(session_id, section_id).then((sectionInfo) => {
            return commonStudent.studentSectionInfo(student_section_id).then((studentInfo) => {
                return commonSchool.getSessionList(session_id).then((monthList) => {
                    return commonAttendance.studentAttendance(student_section_id).then((studentAttendance) => {
                        return stuTotalReport(studentAttendance, monthList, (data) => {
                            return getMonthDailyAttendance(studentAttendance, (dailyAttendance) => {
                                res.json({
                                    status: true,
                                    message: 'Student attendance report get successfully',
                                    data: {
                                        workingDays: data.workingTotal,
                                        presentDays: data.presentTotal,
                                        absentDays: data.absentTotal,
                                        lateDays: data.lateTotal,
                                        notAbsentDays: data.notAbsentTotal,
                                        overAllPercentage: data.rate,
                                        minAttendance: branchInfo.min_attendance,
                                        monthReport: data.report,
                                        dailyReport: dailyAttendance.dailyAttendance,
                                        allAttendance: dailyAttendance.allAttendance,
                                        sectionInfo,
                                        studentInfo
                                    }
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

module.exports = studentReport;

function stuTotalReport(data, monthList, callback) {
    const workingArray = [];
    const workingTotal = data.length;

    const presentArray = [];
    let presentTotal = 0;

    const absentArray = [];
    let absentTotal = 0;

    const lateArray = [];
    let lateTotal = 0;

    const notAbsentArray = [];
    let notAbsentTotal = 0;


    data.forEach(element => {
        if (!workingArray.some(function (row) {
            return row.month === element.month_name;
        })) {
            workingArray.push({
                month: element.month_name,
                days: 1
            });
        } else {
            const targetRow = workingArray.filter(function (targetRow) {
                return targetRow.month === element.month_name;
            })[0];
            targetRow.days += 1;
        }


        if (element.status === 1) {
            presentTotal++;
            notAbsentTotal++;

            if (!presentArray.some(function (row) {
                return row.month === element.month_name;
            })) {
                presentArray.push({
                    month: element.month_name,
                    days: 1
                });
            } else {
                const targetRow = presentArray.filter(function (targetRow) {
                    return targetRow.month === element.month_name;
                })[0];
                targetRow.days += 1;
            }


            if (!notAbsentArray.some(function (row) { return row.month === element.month_name; })) {
                notAbsentArray.push({
                    month: element.month_name,
                    days: 1,
                    total_days: 0
                });
            } else {
                const targetRow = notAbsentArray.filter(function (targetRow) {
                    return targetRow.month === element.month_name;
                })[0];
                targetRow.days += 1;
            }
        } else if (element.status === 3) {
            lateTotal++;
            notAbsentTotal++;
            if (!lateArray.some(function (row) {
                return row.month === element.month_name;
            })) {
                lateArray.push({
                    month: element.month_name,
                    days: 1
                });
            } else {
                const targetRow = lateArray.filter(function (targetRow) {
                    return targetRow.month === element.month_name;
                })[0];
                targetRow.days += 1;
            }


            if (!notAbsentArray.some(function (row) {
                return row.month === element.month_name;
            })) {
                notAbsentArray.push({
                    month: element.month_name,
                    days: 1,
                    total_days: 0
                });
            } else {
                const targetRow = notAbsentArray.filter(function (targetRow) {
                    return targetRow.month === element.month_name;
                })[0];
                targetRow.days += 1;
            }
        } else {
            absentTotal++;
            if (!absentArray.some(function (row) {
                return row.month === element.month_name;
            })) {
                absentArray.push({
                    month: element.month_name,
                    days: 1
                });
            } else {
                const targetRow = absentArray.filter(function (targetRow) {
                    return targetRow.month === element.month_name;
                })[0];
                targetRow.days += 1;
            }
        }
    });

    const finalWorking = [];
    const finalPresent = [];
    const finalAbsent = [];
    const finalLate = [];
    const finalNotAbsent = [];


    monthList.forEach((element) => {
        if (!workingArray.some((row) => { return row.month === element; })) {
            finalWorking.push({
                month: element,
                days: 0
            });
        } else {
            const targetRow = workingArray.filter((targetRow) => {
                return targetRow.month === element;
            })[0];
            finalWorking.push({
                month: targetRow.month,
                days: targetRow.days,
            });
        }

        if (!presentArray.some((row) => { return row.month === element; })) {
            finalPresent.push({
                month: element,
                days: 0
            });
        } else {
            const targetRow = presentArray.filter((targetRow) => {
                return targetRow.month === element;
            })[0];
            finalPresent.push({
                month: targetRow.month,
                days: targetRow.days
            });
        }

        if (!absentArray.some((row) => { return row.month === element; })) {
            finalAbsent.push({
                month: element,
                days: 0
            });
        } else {
            const targetRow = absentArray.filter((targetRow) => {
                return targetRow.month === element;
            })[0];
            finalAbsent.push({
                month: targetRow.month,
                days: targetRow.days
            });
        }

        if (!lateArray.some((row) => { return row.month === element; })) {
            finalLate.push({
                month: element,
                days: 0
            });
        } else {
            const targetRow = lateArray.filter((targetRow) => {
                return targetRow.month === element;
            })[0];
            finalLate.push({
                month: targetRow.month,
                days: targetRow.days
            });
        }

        if (!notAbsentArray.some((row) => { return row.month === element; })) {
            finalNotAbsent.push({
                month: element,
                days: 0, 
                total_days: 0
            });
        } else {
            const targetRow = notAbsentArray.filter((targetRow) => {
                return targetRow.month === element;
            })[0];
            finalNotAbsent.push({
                month: targetRow.month,
                days: targetRow.days,
                total_days: targetRow.total_days
            });
        }
    });


    workingArray.forEach((element) => {
        if (finalNotAbsent.some((row) => { return row.month === element.month; })) {
            const targetRow = finalNotAbsent.filter(function (targetRow) {
                return targetRow.month === element.month;
            })[0];
            targetRow.total_days = element.days;
        }
    });

    return callback({
        workingTotal,
        presentTotal,
        absentTotal,
        lateTotal,
        notAbsentTotal,
        report: [
            { type: 'Working', total: workingTotal, info: finalWorking },
            { type: 'Present', total: presentTotal, info: finalPresent },
            { type: 'Late', total: lateTotal, info: finalLate },
            { type: 'Absent', total: absentTotal, info: finalAbsent },
            { type: 'Rate', total: notAbsentTotal, info: finalNotAbsent },
        ]
    });
}

function getMonthDailyAttendance(data, callback) {
    const dailyAttendance = [];
    const allAttendance = [];
    data.forEach((element) => {
        allAttendance.push({
            month: element.month_name,
            date: element.date,
            status: element.status
        });

        if (!dailyAttendance.some(function (row) {
            return row.month === element.month_name;
        })) {
            dailyAttendance.push({
                month: element.month_name,
                days: [{
                    date: element.date,
                    status: element.status
                }]
            });
        } else {
            const targetRow = dailyAttendance.filter(function (targetRow) {
                return targetRow.month === element.month_name;
            })[0];
            targetRow.days.push({
                date: element.date,
                status: element.status
            });
        }
    });
    return callback({ dailyAttendance, allAttendance });
}

