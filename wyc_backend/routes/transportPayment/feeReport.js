const commonTransport = require('../../common/transport');
const db = require('../../database');
const TransportPayment = db.models.TransportPayment;
const StudentSection = db.models.StudentSection;
const TransportInvoice = db.models.TransportInvoice;
const Class = db.models.Class;
const Section = db.models.Section;
const Student = db.models.Student;
const Parent = db.models.Parent;

function feeReport(req, res, next) {
    const session_id = req.query.session_id;

    const studentCondition = {
        session_id,
        '$student.mode_of_transport$': 'Bus'
    };

    const invoiceCondition = {
        '$studentSection.session_id$': session_id,
        '$studentSection.student.mode_of_transport$': 'Self'
    };

    const paymentCondition = { '$studentSection.session_id$': session_id };

    if (req.query.stu_sec_id) {
        studentCondition['id'] = req.query.stu_sec_id;
        invoiceCondition['student_section_id'] = req.query.stu_sec_id;
        paymentCondition['student_section_id'] = req.query.stu_sec_id;
    }

    if (req.query.section_id) {
        studentCondition['section_id'] = req.query.section_id;
        invoiceCondition['$studentSection.section_id$'] = req.query.section_id;
        paymentCondition['$studentSection.section_id$'] = req.query.section_id;
    }

    if (req.query.amount) {
        if (req.query.amount === '0') {
            studentCondition['$student.trans_payable_amount$'] = {
                $eq: req.query.amount
            };
            invoiceCondition['$studentSection.student.trans_payable_amount$'] = {
                $eq: req.query.amount
            };
        } else {
            studentCondition['$student.trans_payable_amount$'] = {
                $gte: req.query.amount
            };
            invoiceCondition['$studentSection.student.trans_payable_amount$'] = {
                $gte: req.query.amount
            };
        }
    }

    const includeStudent = {
        required: true,
        attributes: ['id', 'first_name', 'last_name', 'mode_of_transport', 'trans_enable_date', 'trans_payable_amount', 'payable_amount'],
        model: Student,
        as: 'student',
        include:[{
            required: true,
            attributes: ['id', 'contact_no'],
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
        commonTransport.getSessionCollection(session_id),
        StudentSection.findAll({
            attributes: ['id', 'roll_no', 'student_type', 'status'],
            include: [includeStudent, includeClassSection],
            where: studentCondition,
            order: '`section.class.sort`, `section.name`, roll_no, `student.first_name`,`student.last_name`'
        }),
        TransportInvoice.findAll({
            include: [{
                required: true,
                attributes: ['id'],
                model: StudentSection,
                as: 'studentSection',
                include: [includeStudent, includeClassSection]
            }],
            where: invoiceCondition,
            group: 'student_section_id'
        }),
        TransportPayment.findAll({
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
    ]).then(([schoolCollection, currentTransStudents, pastTransStudents, payment]) => {
        return getStudentList(currentTransStudents, pastTransStudents, (studentList) => {
            return getPaymentList(studentList, payment, (paymentInfo) => {
                res.json({
                    status: true,
                    message: 'Fee report get successfully',
                    data: {
                        schoolCollection,
                        student: paymentInfo
                    }
                });
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = feeReport;

function getStudentList(currentStudents, pastStudents, callback) {
    const finalArray = [];
    let unpaid = 0;

    currentStudents.forEach(element => {
        unpaid = unpaid + parseInt(element.student.trans_payable_amount);
        finalArray.push({
            student_section_id: element.id,
            student_id: element.student.id,
            roll_no: element.roll_no,
            first_name: element.student.first_name,
            last_name: element.student.last_name,
            contact_no :element.student.parent.contact_no,
            mode_of_transport: element.student.mode_of_transport,
            trans_enable_date: element.student.trans_enable_date,
            class: element.section.class.name,
            section_id: element.section.id,
            section: element.section.name,
            unpaid: element.student.trans_payable_amount,
            fee_unpaid: element.student.payable_amount,
            paid: 0,
            cash: 0,
            cheque: 0,
            bank: 0,
            online: 0
        });
    });

    pastStudents.forEach(element => {
        unpaid = unpaid + parseInt(element.studentSection.student.trans_payable_amount);
        finalArray.push({
            student_section_id: element.studentSection.id,
            student_id: element.studentSection.student.id,
            roll_no: element.studentSection.roll_no,
            first_name: element.studentSection.student.first_name,
            last_name: element.studentSection.student.last_name,
            mode_of_transport: element.studentSection.student.mode_of_transport,
            trans_enable_date: element.studentSection.student.trans_enable_date,
            class: element.studentSection.section.class.name,
            section_id: element.studentSection.section.id,
            section: element.studentSection.section.name,
            unpaid: element.studentSection.student.trans_payable_amount,
            fee_unpaid: element.studentSection.student.payable_amount,
            paid: 0,
            cash: 0,
            cheque: 0,
            bank: 0,
            online: 0
        });
    });
    return callback({ studentList: finalArray, unpaid });
}

function getPaymentList(students, payment, callback) {
    let paid = 0;
    let cash = 0;
    let cheque = 0;
    let bank = 0;
    let online = 0;
    const finalArray = students.studentList;
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

    return callback({ paid, unpaid: students.unpaid, cash, cheque, bank, online, studentList: finalArray });
}
