const school = require('../../common/school');
const fee = require('../../common/fee');
const transport = require('../../common/transport');

function dashboard(req, res, next) {
    const branch_id = req.query.branch_id;

    Promise.all([
        school.getEmployeeCount(branch_id),
        school.getStudentCount(branch_id),
        school.getStudentAttendance(branch_id),
        fee.getTotalDueAmount(branch_id),
        fee.getTodayPayment(branch_id),
        transport.getTotalDueAmount(branch_id),
        transport.getTotalPaid(branch_id),
        transport.getTodaytransPayment(branch_id),
        transport.getStudentCount(branch_id)

    ]).then(([empCount, stuCount, attendanceCount, dueAmount, todayAmount, transDueAmount, transPaidAmount,todaytransportAmount, tranStudentCount]) => {
        res.json({
            status: true,
            message: 'Dashboard data get successfully',
            data: {
                employee: empCount,
                student: stuCount,
                attendance: attendanceCount,
                dueAmount: isNaN(dueAmount) ? 0 : dueAmount,
                todayPayment: isNaN(todayAmount) ? 0 : todayAmount,
                transDueAmount: isNaN(transDueAmount) ? 0 : transDueAmount,
                transPaidAmount: isNaN(transPaidAmount) ? 0 : transPaidAmount,
                todaytransportAmount: isNaN(todaytransportAmount) ? 0 : todaytransportAmount,
                tranStudentCount: tranStudentCount
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = dashboard;
