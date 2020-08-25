const utils = require('../../lib/utils');
const db = require('../../database');
const FeePayment = db.models.FeePayment;
const StudentSection = db.models.StudentSection;
const Section = db.models.Section;
const Session = db.models.Session;
const Class = db.models.Class;
const Student = db.models.Student;
const Parent = db.models.Parent;

function paymentReport(req, res, next) {
    const whereCondition = {
        '$studentSection.session.branch_id$':req.query.branch_id
    };

    if (req.query.date) {
        whereCondition.payment_date = utils.formatDate(req.query.date);
    }

    if (req.query.from_date && req.query.to_date) {
        whereCondition.payment_date = {
            $gte: utils.formatDate(req.query.from_date),
            $lte: utils.formatDate(req.query.to_date)
        };
    }

    if (req.query.section_id) {
        whereCondition['$studentSection.section_id$'] = req.query.section_id;
    }

    if (req.query.stu_sec_id) {
        whereCondition.student_section_id = req.query.stu_sec_id;
    }

    FeePayment.findAll({
        attributes: ['id', 'amount', 'payment_mode'],
        include: [{
           required: true,
           attributes: ['id', 'section_id'],
           model: StudentSection,
           as: 'studentSection',
           include: [{
               required: true,
               attributes: ['id', 'first_name', 'last_name'],
               model: Student,
               as: 'student',
               include:[{
           required: true,
           attributes: ['id', 'contact_no','father_name'],
           model: Parent,
           as: 'parent',
       }]
           }, {
               required: true,
               attributes: ['id', 'name'],
               model: Section,
               as: 'section',
               include: [{
                   required: true,
                   attributes: ['name'],
                   model: Class,
                   as: 'class',
               }]
           }, {
               required: true,
               attributes: [],
               model: Session,
               as: 'session'
           }]
       }],
        where: whereCondition
    }).then((data) => {
        if (data.length > 0) {
            return getFinalResult(data, (result) => {
                res.json({
                    status: true,
                    message: 'Payment listed successfully',
                    data: result
                });
            });
        } else {
            res.json({
                status: false,
                message: 'No payment found'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = paymentReport;

function getFinalResult(data, callback) {
    const result = [];
    let total = 0;
    let totalCash = 0;
    let totalCheque = 0;
    let totalBank = 0;
    let totalOnline = 0;

    data.forEach(element => {
        total += parseInt(element.amount);
        if (!result.some((row) => { return row.id === element.studentSection.id; })) {
            result.push({
                id: element.studentSection.id,
                first_name: element.studentSection.student.first_name,
                last_name: element.studentSection.student.last_name,
                contact_no: element.studentSection.student.parent.contact_no,
                class: element.studentSection.section.class.name,
                section: element.studentSection.section.name,
                amount: element.amount,
                cash: element.payment_mode === 'Cash' ? parseInt(element.amount) : 0,
                cheque: element.payment_mode === 'Cheque' ? parseInt(element.amount) : 0,
                bankDeposit: element.payment_mode === 'Bank Deposit' ? parseInt(element.amount) : 0,
                online: element.payment_mode !== 'Bank Deposit' && element.payment_mode !== 'Cash' && element.payment_mode !== 'Cheque' ? parseInt(element.amount) : 0,
            });

            if (element.payment_mode === 'Cash') {
                totalCash += parseInt(element.amount);
            } else if (element.payment_mode === 'Cheque') {
                totalCheque += parseInt(element.amount);
            } else if (element.payment_mode === 'Bank Deposit') {
                totalBank += parseInt(element.amount);
            } else {
                totalOnline += parseInt(element.amount);
            }
        } else {
            const targetRow = result.filter((row) => { return row.id === element.studentSection.id; })[0];
            targetRow.amount += parseInt(element.amount);
            if (element.payment_mode === 'Cash') {
                totalCash += parseInt(element.amount);
                targetRow.cash += parseInt(element.amount);
            } else if (element.payment_mode === 'Cheque') {
                totalCheque += parseInt(element.amount);
                targetRow.cheque += parseInt(element.amount);
            } else if (element.payment_mode === 'Bank Deposit') {
                totalBank += parseInt(element.amount);
                targetRow.bankDeposit += parseInt(element.amount);
            } else {
                totalOnline += parseInt(element.amount);
                targetRow.online += parseInt(element.amount);
            }
        }
    });
    return callback({ total, totalCash, totalCheque, totalBank, totalOnline, stuInfo: result });
}
