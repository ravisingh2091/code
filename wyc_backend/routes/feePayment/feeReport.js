const commonFee = require('../../common/fee');
const db = require('../../database');
const FeePayment = db.models.FeePayment;
const StudentSection = db.models.StudentSection;
const Class = db.models.Class;
const Section = db.models.Section;
const Student = db.models.Student;
const Parent = db.models.Parent;

function feeReport(req, res, next) {
    const session_id = req.query.session_id;

    const studentCondition = { session_id };
    const paymentCondition = { '$studentSection.session_id$': session_id };

    if (req.query.stu_sec_id) {
        studentCondition['id'] = req.query.stu_sec_id;
        paymentCondition['student_section_id'] = req.query.stu_sec_id;
    }

    if (req.query.section_id) {
        studentCondition['section_id'] = req.query.section_id;
        paymentCondition['$studentSection.section_id$'] = req.query.section_id;
    }

    if (req.query.amount) {
        if (req.query.amount === '0') {
            studentCondition['$student.payable_amount$'] = {
                $eq: req.query.amount
            };
            paymentCondition['$studentSection.student.payable_amount$'] = {
                $eq: req.query.amount
            };
        } else {
            studentCondition['$student.payable_amount$'] = {
                $gte: req.query.amount
            };
            paymentCondition['$studentSection.student.payable_amount$'] = {
                $gte: req.query.amount
            };
        }
    }

    const includeStudent = {
        required: true,
        attributes: ['id', 'first_name', 'last_name', 'payable_amount','admission_no'],
        model: Student,
        as: 'student',
        include:[{
            required: true,
            attributes: ['id', 'contact_no','father_name'],
            model: Parent,
            as: 'parent',
        }]
    };
    const includeClassSection = {
        required: true,
        attributes: ['id', 'name'],
        model: Section,
        as: 'section',
        include: [{
            required: true,
            attributes: ['id', 'name', 'sort'],
            model: Class,
            as: 'class',
        }]
    };

    Promise.all([
        commonFee.getSessionCollection(session_id),
        StudentSection.findAll({
            attributes: ['id', 'roll_no', 'student_type', 'status'],
            include: [includeStudent, includeClassSection],
            where: studentCondition,
            order: '`section.class.sort`, `section.name`, roll_no, `student.first_name`,`student.last_name`'
        }),
        FeePayment.findAll({
            attributes: ['id', 'amount', 'payment_mode'],
            include: [{
                required: true,
                attributes: ['id'],
                model: StudentSection,
                as: 'studentSection',
                include: [includeStudent, includeClassSection]
            }],
            where: paymentCondition
        })
    ]).then(([schoolCollection, student, payment]) => {
        return getStudentList(student, payment, (studentList) => {
            res.json({
                status: true,
                message: 'Fee report get successfully',
                data: {
                    schoolCollection,
                    student: studentList
                }
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = feeReport;

function getStudentList(student, payment, callback) {
    let paid = 0;
    let unpaid = 0;
    let cash = 0;
    let cheque = 0;
    let bank = 0;
    let online = 0;
    const finalArray = [];

    student.forEach(element => {
        element = element.get();
        unpaid = unpaid + parseInt(element.student.payable_amount);
        finalArray.push({
            student_section_id: element.id,
            student_id: element.student.id,
            roll_no: element.roll_no,
            admission_no:element.student.admission_no,
            first_name: element.student.first_name,
            last_name: element.student.last_name,
            contact_no: element.student.parent.contact_no,
            father_name: element.student.parent.father_name,
            class: element.section.class.name,
            section: element.section.name,
            unpaid: element.student.payable_amount,
            //discountAmount:element.student.fee_discount.amount,
            paid: 0,
            cash: 0,
            cheque: 0,
            bank: 0,
            online: 0

        });
    });

    payment.forEach(element => {
        element = element.get();
        if (finalArray.some(function (row) {
            return row.student_section_id === element.studentSection.id;
        })) {
            paid = paid + parseInt(element.amount);
            const targetRow = finalArray.filter((row) => { return row.student_section_id === element.studentSection.id; })[0];
            targetRow.paid += parseInt(element.amount);
            if (element.payment_mode === 'Cash') {
                cash = cash + parseInt(element.amount);
                targetRow.cash += parseInt(element.amount);
            } else if (element.payment_mode === 'Cheque') {
                cheque = cheque + parseInt(element.amount);
                targetRow.cheque += parseInt(element.amount);
            } else if (element.payment_mode === 'Bank Deposit') {
                bank = bank + parseInt(element.amount);
                targetRow.bank += parseInt(element.amount);
            } else {
                online = online + parseInt(element.amount);
                targetRow.online += parseInt(element.amount);
            }
        }
    });

    return callback({ paid, unpaid, cash, cheque, bank, online, studentList: finalArray });
}
